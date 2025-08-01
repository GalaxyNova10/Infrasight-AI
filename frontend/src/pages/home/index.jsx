import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import Icon from '../../components/AppIcon';

const HomePage = () => {
  const featuredIssues = [
    {
      id: 'CHEN-9821',
      title: 'Sewage Overflow Resolved',
      location: 'Mylapore',
      category: 'Sewage Issues',
      status: 'Resolved',
      resolutionTime: '2 days',
      description: 'Quick resolution of sewage overflow near Kapaleeshwarar Temple'
    },
    {
      id: 'CHEN-9822',
      title: 'Major Pothole Fixed',
      location: 'Anna Salai',
      category: 'Road Issues',
      status: 'Resolved',
      resolutionTime: '1 day',
      description: 'Large pothole on Anna Salai causing traffic disruption was repaired'
    },
    {
      id: 'CHEN-9823',
      title: 'Street Lighting Restored',
      location: 'T. Nagar',
      category: 'Street Lighting',
      status: 'Resolved',
      resolutionTime: '3 days',
      description: 'Complete restoration of street lighting in T. Nagar shopping district'
    }
  ];

  const howItWorksSteps = [
    {
      icon: 'Camera',
      title: 'Report Issue',
      description: 'Citizens take photos and submit detailed reports through our platform'
    },
    {
      icon: 'Brain',
      title: 'AI Analysis',
      description: 'Advanced AI analyzes the issue and routes it to the appropriate GCC department'
    },
    {
      icon: 'Users',
      title: 'GCC Action',
      description: 'Greater Chennai Corporation teams receive alerts and take immediate action'
    },
    {
      icon: 'CheckCircle',
      title: 'Resolution',
      description: 'Issues are resolved and citizens receive real-time updates on progress'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Chennai Civic Watch - Empowering Citizens for Better Infrastructure</title>
        <meta name="description" content="Infrasight AI is a citizen-driven platform that connects residents with the Greater Chennai Corporation to report and resolve infrastructure issues using AI-powered technology." />
        <meta name="keywords" content="Chennai, civic issues, infrastructure, GCC, citizen reporting, AI monitoring" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Navigation Header */}
        <header className="bg-surface border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Icon name="Zap" size={20} color="white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-semibold text-text-primary">Infrasight AI</span>
                  <span className="text-xs text-text-secondary">Chennai Municipal Infrastructure</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <Link to="/public-data" className="text-text-secondary hover:text-primary transition-colors">
                  Public Data
                </Link>
                <Link to="/login" className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                  Official Login
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary to-blue-700 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Empowering Chennai Citizens
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Report infrastructure issues, track resolutions, and help build a better Chennai with the Greater Chennai Corporation
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/report">
                <button className="bg-white text-primary px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors">
                  Report an Issue
                </button>
              </Link>
              <Link to="/public-data">
                <button className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-primary transition-colors">
                  View Public Data
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-muted">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-text-primary mb-4">How It Works</h2>
              <p className="text-xl text-text-secondary max-w-2xl mx-auto">
                A simple 4-step process that connects citizens with GCC for faster issue resolution
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {howItWorksSteps.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icon name={step.icon} size={32} color="white" />
                  </div>
                  <h3 className="text-xl font-semibold text-text-primary mb-3">{step.title}</h3>
                  <p className="text-text-secondary">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Technology Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-text-primary mb-6">Our Technology</h2>
                <p className="text-lg text-text-secondary mb-6">
                  Chennai Civic Watch leverages cutting-edge technology to ensure efficient issue resolution and transparent governance.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Icon name="Brain" size={24} className="text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold text-text-primary">AI-Powered Analysis</h3>
                      <p className="text-text-secondary">Advanced computer vision and machine learning for automatic issue categorization and prioritization</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Icon name="Wifi" size={24} className="text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold text-text-primary">Live Monitoring</h3>
                      <p className="text-text-secondary">Real-time surveillance and monitoring systems across Chennai's infrastructure</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Icon name="Database" size={24} className="text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold text-text-primary">Real-time Data</h3>
                      <p className="text-text-secondary">Instant data synchronization between citizens, GCC departments, and field teams</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-muted rounded-lg p-8">
                <div className="text-center">
                  <Icon name="Zap" size={64} className="text-primary mx-auto mb-4" />
                  <h3 className="text-2xl font-semibold text-text-primary mb-2">Smart City Technology</h3>
                  <p className="text-text-secondary">
                    Leveraging IoT sensors, AI analytics, and mobile technology to create a responsive and efficient urban infrastructure management system.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Issues Section */}
        <section className="py-20 bg-muted">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-text-primary mb-4">Featured Resolved Issues</h2>
              <p className="text-xl text-text-secondary max-w-2xl mx-auto">
                See how our platform has helped resolve critical infrastructure issues across Chennai
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredIssues.map((issue) => (
                <div key={issue.id} className="bg-surface rounded-lg shadow-elevation-2 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-mono text-primary">{issue.id}</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                      {issue.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">{issue.title}</h3>
                  <p className="text-text-secondary mb-4">{issue.description}</p>
                  <div className="flex items-center justify-between text-sm text-text-secondary">
                    <span>📍 {issue.location}</span>
                    <span>⏱️ {issue.resolutionTime}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Link to="/public-data">
                <button className="bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors">
                  View All Resolved Issues
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-20 bg-primary text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to Make a Difference?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of Chennai citizens who are actively contributing to better infrastructure through our platform
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/report">
                <button className="bg-white text-primary px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors">
                  Report an Issue Now
                </button>
              </Link>
              <Link to="/login">
                <button className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-primary transition-colors">
                  Official Login
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-surface border-t border-border py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <Icon name="Zap" size={20} color="white" />
                  </div>
                  <span className="text-lg font-semibold text-text-primary">Chennai Civic Watch</span>
                </div>
                <p className="text-text-secondary mb-4 max-w-md">
                  Empowering Chennai citizens and the Greater Chennai Corporation with AI-driven infrastructure monitoring and community engagement tools.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-text-primary mb-4">Quick Links</h3>
                <ul className="space-y-2 text-text-secondary">
                  <li><Link to="/report" className="hover:text-primary">Report Issue</Link></li>
                  <li><Link to="/public-data" className="hover:text-primary">Public Data</Link></li>
                  <li><Link to="/login" className="hover:text-primary">Official Login</Link></li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-text-primary mb-4">Contact</h3>
                <ul className="space-y-2 text-text-secondary">
                  <li>Greater Chennai Corporation</li>
                  <li>Email: civicwatch@gcc.gov.in</li>
                  <li>Phone: +91-44-2538-0000</li>
                </ul>
              </div>
            </div>

            <div className="border-t border-border mt-8 pt-8 text-center text-text-secondary">
              <p>&copy; {new Date().getFullYear()} Infrasight AI. All rights reserved. | Powered by Greater Chennai Corporation</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default HomePage; 