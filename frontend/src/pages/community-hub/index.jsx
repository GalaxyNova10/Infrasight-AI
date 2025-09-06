import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet.heat";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "react-circular-progressbar/dist/styles.css";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import MarkerClusterGroup from "react-leaflet-cluster";
import { Link } from "react-router-dom";
import CountUp from "react-countup";
import { getCommunityData } from "../../services/api";
import { HiOutlineMegaphone } from "react-icons/hi2";
import { FaSignInAlt } from "react-icons/fa";

const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});

const blueIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});

  const HeatmapLayer = ({ issues, showHeatmap }) => {
    const map = useMap();
    const heatLayerRef = useRef(null);

    useEffect(() => {
    // If the heatmap should be visible and there is data
    if (showHeatmap && issues) {
      // Remove the old layer to prevent duplicates
      if (heatLayerRef.current) {
        map.removeLayer(heatLayerRef.current);
      }
      
      // Create data points in the format: [latitude, longitude, intensity]
      const points = issues.map(issue => [issue.latitude, issue.longitude, 1.0]);

      // Create a new heat layer and add it to the map
      heatLayerRef.current = L.heatLayer(points, { radius: 25, blur: 15 });
      map.addLayer(heatLayerRef.current);

    } else if (heatLayerRef.current) {
      // If the heatmap should be hidden, remove the layer
      map.removeLayer(heatLayerRef.current);
      heatLayerRef.current = null;
    }
  }, [showHeatmap, issues, map]); // Reruns when these values change

  return null; // This component draws on the map but renders no visible JSX
};

// Fix for default marker icon issue with Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

  const getBadge = (issueType) => {
    switch (issueType) {
      case "road_issues":
        return "🛣️ Pothole Pioneer";
      case "garbage_issues":
        return "♻️ Cleanliness Champion";
      case "streetlight_issues":
        return "💡 Safety Steward";
      default:
        return "👍 Community Contributor";
    }
  };

const CommunityHub = () => {
  const [communityData, setCommunityData] = useState(null);
  const [mapFilter, setMapFilter] = useState("all");
  const [showHeatmap, setShowHeatmap] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getCommunityData();
        // Check if the response contains an error from the backend
        if (response.data && response.data.error) {
          console.error("Backend error fetching community data:", response.data.error);
          setCommunityData({ // Set a default error state
            stats: { issuesResolvedThisMonth: 0, activeReporters: 0, communityImpactScore: 0 },
            leaderboard: [],
            events: [],
            spotlight: [],
            developmentNews: [],
            issues: []
          });
        } else {
          setCommunityData(response.data);
        }
      } catch (error) {
        console.error("Error fetching community data:", error);
        setCommunityData({ // Set a default error state
          stats: { issuesResolvedThisMonth: 0, activeReporters: 0, communityImpactScore: 0 },
          leaderboard: [],
          events: [],
          spotlight: [],
          developmentNews: [],
          issues: []
        });
      }
    };
    fetchData();
  }, []);

  if (!communityData) {
    return (
      <div className="min-h-screen bg-background flex justify-center items-center">
        <div className="text-center">
          <svg className="animate-spin h-10 w-10 text-primary mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-foreground mt-4">Loading Community Data...</p>
        </div>
      </div>
    );
  }

  const {
    stats = {},
    leaderboard = [],
    events = [],
    spotlight = [],
    developmentNews = [],
    issues = []
  } = communityData;

    const filteredIssues = (issues || []).filter((issue) => {
    if (mapFilter === "reported") {
      return issue.status !== "Resolved";
    } else if (mapFilter === "resolved") {
      return issue.status === "Resolved";
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8 text-foreground">
      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center rounded-3xl shadow-xl p-8 sm:p-12 mb-10 overflow-hidden"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1598091498127-aa52143159c7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')", // Chennai landmark placeholder
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50 rounded-3xl"></div>
        <div className="relative z-10 text-center text-white">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4 drop-shadow-lg">
            Our Community, Our Chennai
          </h1>
          <p className="text-lg sm:text-xl mb-8 max-w-2xl mx-auto opacity-90">
            See the collective impact of citizens making our city better, one
            report at a time.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-8">
            <div className="flex flex-col items-center justify-center w-40 h-40 sm:w-48 sm:h-48 bg-black/20 rounded-full border-2 border-primary/50 backdrop-blur-sm">
                <CountUp end={stats?.issuesResolvedThisMonth || 0} duration={2.5} className="text-5xl font-bold text-white" />
                <p className="text-center mt-2 text-sm sm:text-base text-white/80">
                  Issues Resolved
                </p>
            </div>
            <div className="flex flex-col items-center justify-center w-40 h-40 sm:w-48 sm:h-48 bg-black/20 rounded-full border-2 border-primary/50 backdrop-blur-sm">
                <CountUp end={stats?.activeReporters || 0} duration={2.5} className="text-5xl font-bold text-white" />
                <p className="text-center mt-2 text-sm sm:text-base text-white/80">
                  Active Reporters
                </p>
            </div>
          </div>
        </div>
      </section>

      {/* Community Impact Score */}
      <section className="text-center my-10">
        <h2 className="text-3xl font-bold text-foreground mb-6">Community Impact Score</h2>
        <div className="w-64 h-64 mx-auto filter drop-shadow-[0_0_15px_hsl(var(--primary)/0.5)]">
          <CircularProgressbar
            value={stats.communityImpactScore}
            text={`${stats.communityImpactScore}%`}
            circleRatio={0.75}
            styles={buildStyles({
                rotation: 1 / 2 + 1 / 8,
                strokeLinecap: 'round',
                pathTransitionDuration: 1.5,
                pathColor: `hsl(var(--primary))`,
                textColor: `hsl(var(--foreground))`,
                trailColor: 'hsl(var(--muted))',
            })}
          />
        </div>
      </section>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Map and News */}
        <div className="lg:col-span-2 space-y-6">
          {/* Interactive Community Map */}
          <div className="glass-card p-4 h-[500px] flex flex-col">
            <h2 className="text-2xl font-bold mb-4 text-foreground">
              Interactive Community Map
            </h2>
            <div className="flex justify-center gap-4 mb-4">
              <button
                onClick={() => setMapFilter("all")}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                  mapFilter === "all"
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-secondary text-secondary-foreground hover:bg-muted"
                }`}
              >
                All Issues
              </button>
              <button
                onClick={() => setMapFilter("reported")}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                  mapFilter === "reported"
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-secondary text-secondary-foreground hover:bg-muted"
                }`}
              >
                Reported Issues
              </button>
              <button
                onClick={() => setMapFilter("resolved")}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                  mapFilter === "resolved"
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-secondary text-secondary-foreground hover:bg-muted"
                }`}
              >
                Resolved Issues
              </button>
              <button
                onClick={() => setShowHeatmap(!showHeatmap)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                  showHeatmap
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-secondary text-secondary-foreground hover:bg-muted"
                }`}
              >
                {showHeatmap ? "Hide Heatmap" : "Show Heatmap"}
              </button>
            </div>
            <div className="flex-grow rounded-2xl overflow-hidden">
              <MapContainer
                center={[13.0827, 80.2707]} // Centered on Chennai
                zoom={12}
                className="h-full w-full"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <MarkerClusterGroup>
                  {filteredIssues.map((issue) => (
                    <Marker
                      key={issue.id}
                      position={[issue.latitude, issue.longitude]}
                      icon={issue.status === "Resolved" ? greenIcon : blueIcon}
                      eventHandlers={{
                        mouseover: (event) => {
                          event.target.openPopup();
                          event.target.getElement().classList.add('marker-hover');
                        },
                        mouseout: (event) => {
                          event.target.closePopup();
                          event.target.getElement().classList.remove('marker-hover');
                        },
                      }}
                    >
                      <Popup>
                        <div className="font-semibold">{issue.type.replace('_', ' ').toUpperCase()}</div>
                        <div>Status: {issue.status}</div>
                      </Popup>
                    </Marker>
                  ))}
                </MarkerClusterGroup>
                 <HeatmapLayer issues={issues} showHeatmap={showHeatmap} />
              </MapContainer>
            </div>
          </div>

          {/* Chennai Development Feed */}
          <div className="glass-card p-6">
            <h2 className="text-2xl font-bold mb-4 text-foreground">
              Chennai Development Feed
            </h2>
            <div className="space-y-4">
              {developmentNews.map((article, index) => (
                <div
                  key={index}
                  className="flex items-center bg-secondary rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  {article.imageUrl && (
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="w-24 h-24 object-cover rounded-xl mr-4"
                    />
                  )}
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                      {article.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {article.summary}
                    </p>
                    <a
                      href={article.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-sm font-medium"
                    >
                      Read More
                    </a>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-6 w-full bg-primary text-primary-foreground py-3 rounded-full font-semibold hover:bg-primary/90 transition-colors duration-300 shadow-md">
              View More News
            </button>
          </div>
        </div>

        {/* Right Column - Leaderboard, Spotlight, Events */}
        <div className="lg:col-span-1 space-y-6">
          {/* Top Reporters Leaderboard */}
          <div className="glass-card p-6">
            <h2 className="text-2xl font-bold mb-4 text-foreground">
              Top Reporters
            </h2>
            <ul className="space-y-3">
              {leaderboard.map((reporter, index) => (
                <li
                  key={index}
                  className="flex items-center bg-secondary rounded-xl p-3 shadow-sm"
                >
                  <span className="font-bold text-lg mr-3 w-8 text-center">
                    {index === 0 && "🥇"}
                    {index === 1 && "🥈"}
                    {index === 2 && "🥉"}
                    {index > 2 && `#${index + 1}`}
                  </span>
                  <img
                    src={reporter.avatarUrl || "https://via.placeholder.com/40"}
                    alt={reporter.username}
                    className="w-10 h-10 rounded-full object-cover mr-3"
                  />
                  <div>
                    <p className="font-semibold text-foreground">
                      {reporter.username}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {reporter.reportCount} Reports
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {getBadge(reporter.mostReportedIssueType)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <button className="mt-6 w-full bg-primary text-primary-foreground py-3 rounded-full font-semibold hover:bg-primary/90 transition-colors duration-300 shadow-md">
              See All Reporters
            </button>
          </div>

          {/* Community Spotlight */}
          <div className="glass-card p-6">
            <h2 className="text-2xl font-bold mb-4 text-foreground">
              Community Spotlight
            </h2>
            <Swiper
              spaceBetween={30}
              centeredSlides={true}
              autoplay={{
                delay: 4500,
                disableOnInteraction: false,
              }}
              pagination={{
                clickable: true,
              }}
              navigation={true}
              modules={[Autoplay, Pagination, Navigation]}
              className="mySwiper rounded-2xl"
            >
              {spotlight.map((story, index) => (
                <SwiperSlide key={index}>
                  <div className="relative bg-secondary rounded-2xl p-6 pb-12 h-auto flex flex-col justify-between">
                    <img src={story.imageUrl || "https://via.placeholder.com/300x150"} alt={story.issueTitle} className="w-full h-32 object-cover rounded-lg shadow-md mb-4" /> 
                    <div className="relative z-10 text-center">
                      <h3 className="text-xl font-bold text-primary mb-2">
                        {story.issueTitle}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-3">
                        Reported by:{" "}
                        <span className="font-semibold">
                          {story.citizenReporter}
                        </span>
                      </p>
                      <p className="text-foreground text-base leading-relaxed">
                        "{story.impactStatement}"
                      </p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Upcoming Events */}
          <div className="glass-card p-6">
            <h2 className="text-2xl font-bold mb-4 text-foreground">
              Upcoming Events
            </h2>
            <ul className="space-y-4">
              {events.map((event, index) => (
                <li
                  key={index}
                  className="bg-secondary rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <h3 className="text-lg font-semibold text-foreground">
                    {event.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    <span className="font-medium">Date:</span> {event.date}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">Location:</span>{" "}
                    {event.location}
                  </p>
                  {/* Small map snippet or link could go here */}
                  <button className="mt-3 text-primary hover:underline text-sm font-medium">
                    Learn More
                  </button>
                </li>
              ))}
            </ul>
            <button className="mt-6 w-full bg-primary text-primary-foreground py-3 rounded-full font-semibold hover:bg-primary/90 transition-colors duration-300 shadow-md">
              View All Events
            </button>
          </div>
        </div>
      </div>

{/* Get Involved Call to Action */}
      <section className="mt-10 text-center">
        <h2 className="text-3xl font-bold text-foreground mb-6">Get Involved!</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <Link
            to="/report"
            className="block glass-card p-8 shadow-lg hover:shadow-2xl hover:shadow-primary transition-shadow duration-300 rounded-2xl ring-2 ring-primary"
          >
            <div className="flex justify-center items-center mb-4">
              <HiOutlineMegaphone size={48} className="text-primary" />
            </div>
            <h3 className="text-xl font-bold text-primary mb-2">
              Report an Issue
            </h3>
            <p className="text-muted-foreground">
              See something that needs fixing? Let us know!
            </p>
          </Link>
          <Link
            to="/login"
            className="block glass-card p-8 shadow-lg hover:shadow-2xl hover:shadow-primary transition-shadow duration-300 rounded-2xl ring-2 ring-primary"
          >
            <div className="flex justify-center items-center mb-4">
              <FaSignInAlt size={48} className="text-primary" />
            </div>
            <h3 className="text-xl font-bold text-primary mb-2">
              Login / Register
            </h3>
            <p className="text-muted-foreground">
              Join our community and track your impact.
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default CommunityHub;