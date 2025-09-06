import React from 'react';

import { Helmet } from 'react-helmet-async';

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

      icon: 'ClipboardList',

      title: 'Report Issue',

      description: 'Citizens take photos and submit detailed reports through our platform',

      image: '/assets/images/report.png'

    },

    {

      icon: 'Cpu',

      title: 'AI Analysis',

      description: 'Advanced AI analyzes the issue and routes it to the appropriate GCC department',

      image: '/assets/images/ai_analysis.png'

    },

    {

      icon: 'Users',

      title: 'GCC Action',

      description: 'Greater Chennai Corporation teams receive alerts and take immediate action',

      image: '/assets/images/gcc_action.png'

    },

    {

      icon: 'CheckCircle',

      title: 'Resolution',

      description: 'Issues are resolved and citizens receive real-time updates on progress',

      image: '/assets/images/resolution.png'

    }

  ];



  const communitySpotlight = [

    {

      name: 'Ravi Kumar',

      location: 'Adyar',

      contribution: 'Reported over 50 issues, leading to a cleaner and safer neighborhood.',

      gender: 'male'

    },

    {

      name: 'Priya Singh',

      location: 'Velachery',

      contribution: 'Organized a community cleanup drive for Velachery Lake.',

      gender: 'female'

    },

    {

      name: 'Ahmed Khan',

      location: 'Royapettah',

      contribution: 'Actively tracks and follows up on reported issues in his area.',

      gender: 'male'

    }

  ];



  const getInvolved = [

    {

      icon: 'FilePenLine',

      title: 'Become a Reporter',

      description: 'Sign up and start reporting issues in your community.'

    },

    {

      icon: 'Building',

      title: 'GCC Action',

      description: 'Connect with other active citizens in your area.'

    },

    {

      icon: 'Share2',

      title: 'Spread the Word',

      description: 'Share our platform with your friends and family.'

    }

  ];



  return (

    <>

      <Helmet>

        <title>InfraSight AI - Empowering Citizens for Better Infrastructure</title>

        <meta name="description" content="Infrasight AI is a citizen-driven platform that connects residents with the Greater Chennai Corporation to report and resolve infrastructure issues using AI-powered technology." />

        <meta name="keywords" content="Chennai, civic issues, infrastructure, GCC, citizen reporting, AI monitoring" />

      </Helmet>



      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">

        



        {/* Hero Section */}

        <section className="relative bg-gradient-to-br from-gray-900 to-gray-700 text-white py-24 overflow-hidden">

          <div className="absolute inset-0 z-0 opacity-20" style={{ backgroundImage: 'url(/assets/images/chennai_skyline.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight tracking-tight drop-shadow-lg">

              Empowering Chennai's Future

            </h1>

            <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-3xl mx-auto leading-relaxed">

              Report infrastructure issues, track resolutions, and help build a smarter, more resilient Chennai with the Greater Chennai Corporation.

            </p>

            <div className="flex flex-col sm:flex-row gap-5 justify-center">

              <Link to="/report">

                <button className="border-2 border-white text-white px-10 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-primary transition-colors shadow-lg transform hover:-translate-y-1">

                  Report an Issue

                </button>

              </Link>

              <Link to="/public-data">

                <button className="border-2 border-white text-white px-10 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-primary transition-colors shadow-lg transform hover:-translate-y-1">

                  View Public Data

                </button>

              </Link>

              <Link to="/my-reports">

                <button className="border-2 border-white text-white px-10 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-primary transition-colors shadow-lg transform hover:-translate-y-1">

                  My Reports

                </button>

              </Link>

            </div>

          </div>

        </section>



        {/* How It Works Section */}

        <section className="py-20 bg-gradient-to-br from-gray-50 to-white bg-pattern">

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <div className="text-center mb-16">

              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">How It Works</h2>

              <p className="text-xl text-gray-600 max-w-3xl mx-auto">

                A simple 4-step process that connects citizens with GCC for faster, more efficient issue resolution.

              </p>

            </div>

            

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

              {howItWorksSteps.map((step, index) => (

                <div key={index} className="relative flex flex-col items-center text-center p-8 bg-white rounded-xl shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-2 hover:scale-105">

                  <Icon name={step.icon} size={48} className="text-primary mx-auto mb-4" />

                  <h3 className="text-xl font-bold text-gray-800 mb-3">{step.title}</h3>

                  <p className="text-gray-600 text-base">{step.description}</p>

                  {step.title === 'Report Issue' && <p className="text-sm text-gray-500 mt-2">Click to report a new issue.</p>}

                  {step.title === 'AI Analysis' && <p className="text-sm text-gray-500 mt-2">AI categorizes and prioritizes issues.</p>}

                  {step.title === 'GCC Action' && <p className="text-sm text-gray-500 mt-2">Teams dispatched for resolution.</p>}

                  {step.title === 'Resolution' && <p className="text-sm text-gray-500 mt-2">Issue resolved, citizen notified.</p>}

                  {index < howItWorksSteps.length - 1 && (

                    <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 hidden lg:block">

                      <Icon name="ArrowRight" size={48} className="text-gray-300" />

                    </div>

                  )}

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

                  InfraSight AI leverages cutting-edge technology to ensure efficient issue resolution and transparent governance.

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

            

            {featuredIssues && featuredIssues.map((issue) => (

                <div key={issue.id} className="bg-surface rounded-lg shadow-elevation-2 p-6 transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">

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

            

            <div className="text-center mt-12">

              <Link to="/public-data">

                <button className="border-2 border-primary text-primary px-10 py-4 rounded-full text-lg font-semibold hover:bg-primary hover:text-primary-foreground transition-all duration-300 ease-in-out shadow-lg transform hover:-translate-y-1">

                  View All Resolved Issues

                </button>

              </Link>

            </div>

          </div>

        </section>



        {/* Community Spotlight Section */}

        <section className="py-20">

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <div className="text-center mb-16">

              <h2 className="text-4xl font-bold text-text-primary mb-4">Community Spotlight</h2>

              <p className="text-xl text-text-secondary max-w-2xl mx-auto">

                Celebrating the citizens who are making a difference in Chennai.

              </p>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

              {communitySpotlight.map((person) => (

                <div key={person.name} className="bg-white rounded-lg shadow-lg p-6 text-center">

                  <div className={`w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center ${person.gender === 'male' ? 'bg-blue-200' : 'bg-pink-200'}`}>

                    <Icon name="User" size={48} className={`${person.gender === 'male' ? 'text-blue-800' : 'text-pink-800'}`} />

                  </div>

                  <h3 className="text-xl font-semibold text-text-primary">{person.name}</h3>

                  <p className="text-primary mb-2">{person.location}</p>

                  <p className="text-text-secondary">{person.contribution}</p>

                </div>

              ))}

            </div>

          </div>

        </section>



        {/* Get Involved Section */}

        <section className="py-20 bg-muted">

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <div className="text-center mb-16">

              <h2 className="text-4xl font-bold text-text-primary mb-4">Get Involved</h2>

              <p className="text-xl text-text-secondary max-w-2xl mx-auto">

                You have the power to improve your community. Here's how you can start.

              </p>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

              {getInvolved.map((item) => (

                <div key={item.title} className="bg-white rounded-lg shadow-lg p-6 text-center">

                  <Icon name={item.icon} size={48} className="text-primary mx-auto mb-4" />

                  <h3 className="text-xl font-semibold text-text-primary mb-2">{item.title}</h3>

                  <p className="text-text-secondary">{item.description}</p>

                </div>

              ))}

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

                <button className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-primary transition-colors">

                  Report an Issue

                </button>

              </Link>

              <Link to="/login">

                <button className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-primary transition-colors shadow-lg transform hover:-translate-y-1">

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

                  <span className="text-lg font-semibold text-text-primary">InfraSight AI</span>

                </div>

                <p className="text-text-secondary mb-4 max-w-md">

                  Empowering Chennai citizens and the Greater Chennai Corporation with AI-driven infrastructure monitoring and community engagement tools.

                </p>

              </div>



              



              <div>

                <h3 className="font-semibold text-text-primary mb-4">Contact</h3>

                <ul className="space-y-2 text-text-secondary">

                  <li>Greater Chennai Corporation</li>

                  <li>Email: infrasight@gcc.gov.in</li>

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