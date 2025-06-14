import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../services/firebase';
import { FiCheck, FiUpload, FiMapPin, FiPhone } from 'react-icons/fi';
import { FaQrcode } from 'react-icons/fa';

const OnboardingFlow = () => {
  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    address: '',
    phone: '',
    description: '',
    logo: '',
    categories: ['Starters', 'Main Course', 'Desserts', 'Drinks']
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCategoryChange = (index, value) => {
    const newCategories = [...formData.categories];
    newCategories[index] = value;
    setFormData({
      ...formData,
      categories: newCategories
    });
  };

  const addCategory = () => {
    setFormData({
      ...formData,
      categories: [...formData.categories, '']
    });
  };

  const removeCategory = (index) => {
    const newCategories = formData.categories.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      categories: newCategories
    });
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeOnboarding = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      await updateDoc(doc(db, 'restaurants', user.uid), {
        ...formData,
        isSetupComplete: true,
        updatedAt: new Date()
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Error completing onboarding:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    { number: 1, title: 'Restaurant Details', icon: <FiMapPin /> },
    { number: 2, title: 'Branding', icon: <FiUpload /> },
    { number: 3, title: 'Menu Categories', icon: <FaQrcode /> },
    { number: 4, title: 'Complete Setup', icon: <FiCheck /> }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step) => (
              <div key={step.number} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                  currentStep >= step.number 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {currentStep > step.number ? <FiCheck /> : step.number}
                </div>
                <p className="text-xs mt-2 text-gray-600 text-center">{step.title}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Step 1: Restaurant Details */}
          {currentStep === 1 && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Restaurant Details</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Restaurant Address
                  </label>
                  <div className="relative">
                    <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="pl-10 w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Enter your restaurant address"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="pl-10 w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Restaurant Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Tell customers about your restaurant..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Branding */}
          {currentStep === 2 && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Restaurant Branding</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Logo URL (Optional)
                  </label>
                  <div className="relative">
                    <FiUpload className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="url"
                      name="logo"
                      value={formData.logo}
                      onChange={handleChange}
                      className="pl-10 w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="https://example.com/logo.png"
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    You can add your logo URL or upload one later from the dashboard.
                  </p>
                </div>

                {formData.logo && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 mb-2">Logo Preview:</p>
                    <img 
                      src={formData.logo} 
                      alt="Restaurant logo" 
                      className="h-20 w-auto rounded-lg"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Menu Categories */}
          {currentStep === 3 && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Menu Categories</h2>
              <p className="text-gray-600 mb-6">
                Set up your menu categories. You can always modify these later.
              </p>
              
              <div className="space-y-4">
                {formData.categories.map((category, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={category}
                      onChange={(e) => handleCategoryChange(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Category name"
                    />
                    {formData.categories.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeCategory(index)}
                        className="text-red-600 hover:text-red-800 px-2 py-1"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={addCategory}
                  className="text-primary-600 hover:text-primary-800 font-medium"
                >
                  + Add Category
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Complete Setup */}
          {currentStep === 4 && (
            <div className="animate-fade-in text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiCheck className="w-8 h-8 text-secondary-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Almost Done!</h2>
                <p className="text-gray-600">
                  Your restaurant profile is ready. You can now start adding menu items and generate your QR code.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">What's Next?</h3>
                <ul className="text-left space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <FiCheck className="w-4 h-4 text-secondary-600 mr-2" />
                    Add your first menu items
                  </li>
                  <li className="flex items-center">
                    <FiCheck className="w-4 h-4 text-secondary-600 mr-2" />
                    Generate your restaurant's QR code
                  </li>
                  <li className="flex items-center">
                    <FiCheck className="w-4 h-4 text-secondary-600 mr-2" />
                    Print and place QR codes on tables
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {currentStep < 4 ? (
              <button
                onClick={nextStep}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Next
              </button>
            ) : (
              <button
                onClick={completeOnboarding}
                disabled={isLoading}
                className="px-6 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 disabled:opacity-50"
              >
                {isLoading ? 'Setting up...' : 'Complete Setup'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;