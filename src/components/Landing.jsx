import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiSmartphone, FiTrendingUp, FiStar } from 'react-icons/fi';
import { FaQrcode } from 'react-icons/fa';

const Landing = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const features = [
    {
      icon: <FaQrcode className="w-8 h-8" />,
      title: "QR Code Menus",
      description: "Generate instant QR codes for contactless menu viewing"
    },
    {
      icon: <FiSmartphone className="w-8 h-8" />,
      title: "Mobile Optimized",
      description: "Perfect viewing experience on all mobile devices"
    },
    {
      icon: <FiTrendingUp className="w-8 h-8" />,
      title: "Easy Management",
      description: "Simple dashboard to manage your menu items and pricing"
    }
  ];

  const testimonials = [
    {
      name: "Maria Rodriguez",
      restaurant: "Bella Vista Cafe",
      text: "Scan2Dine helped us go contactless in minutes. Our customers love it!",
      rating: 5
    },
    {
      name: "James Wilson",
      restaurant: "The Corner Bistro",
      text: "Super easy to set up and manage. Saved us printing costs too!",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <FaQrcode className="w-8 h-8 text-primary-600" />
              <span className="text-2xl font-bold text-gray-900">Scan2Dine</span>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-600 hover:text-primary-600 transition-colors">Features</a>
              <a href="#testimonials" className="text-gray-600 hover:text-primary-600 transition-colors">Reviews</a>
              <a href="#pricing" className="text-gray-600 hover:text-primary-600 transition-colors">Pricing</a>
            </nav>

            <div className="hidden md:flex items-center space-x-4">
              <Link 
                to="/login" 
                className="text-gray-600 hover:text-primary-600 transition-colors"
              >
                Sign In
              </Link>
              <Link 
                to="/signup" 
                className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile menu button */}
            <button 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                <span className="h-0.5 bg-gray-600 w-full"></span>
                <span className="h-0.5 bg-gray-600 w-full"></span>
                <span className="h-0.5 bg-gray-600 w-full"></span>
              </div>
            </button>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="md:hidden pb-4 border-t border-gray-200 pt-4">
              <div className="flex flex-col space-y-4">
                <a href="#features" className="text-gray-600">Features</a>
                <a href="#testimonials" className="text-gray-600">Reviews</a>
                <a href="#pricing" className="text-gray-600">Pricing</a>
                <Link to="/login" className="text-gray-600">Sign In</Link>
                <Link 
                  to="/signup" 
                  className="bg-primary-600 text-white px-6 py-2 rounded-lg text-center"
                >
                  Get Started
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 animate-fade-in">
            Digital Menus Made
            <span className="text-primary-600"> Simple</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 animate-fade-in">
            Create beautiful QR code menus for your restaurant in minutes. 
            No app downloads required for your customers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <Link 
              to="/signup" 
              className="bg-primary-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-700 transition-colors transform hover:scale-105"
            >
              Start Free Trial
            </Link>
            <button className="border-2 border-primary-600 text-primary-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-50 transition-colors">
              View Demo
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-600">
              Powerful features designed for modern restaurants
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="text-center p-8 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-primary-600 mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Get started in just 3 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Sign Up & Setup",
                description: "Create your account and add your restaurant details"
              },
              {
                step: "2",
                title: "Add Your Menu",
                description: "Upload your menu items with prices and descriptions"
              },
              {
                step: "3",
                title: "Generate QR Code",
                description: "Download and print your QR code for tables"
              }
            ].map((step, index) => (
              <div key={index} className="text-center animate-fade-in" style={{ animationDelay: `${index * 0.2}s` }}>
                <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="bg-gray-50 p-8 rounded-xl animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FiStar key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "{testimonial.text}"
                </p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-gray-600">{testimonial.restaurant}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Go Digital?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of restaurants already using Scan2Dine
          </p>
          <Link 
            to="/signup" 
            className="bg-white text-primary-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-block transform hover:scale-105"
          >
            Start Your Free Trial
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <FaQrcode className="w-6 h-6" />
                <span className="text-xl font-bold">Scan2Dine</span>
              </div>
              <p className="text-gray-400">
                Making restaurant menus accessible and contactless.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Demo</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">Status</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Scan2Dine. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;