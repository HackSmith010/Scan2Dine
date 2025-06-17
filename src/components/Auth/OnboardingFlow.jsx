import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../services/firebase';
import { FiCheck, FiUpload, FiMapPin, FiPhone, FiPlus, FiX } from 'react-icons/fi';
import { FaQrcode } from 'react-icons/fa';
import { motion } from 'framer-motion';

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
      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Progress Bar */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between">
            {steps.map((step) => (
              <div key={step.number} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
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
            <motion.div 
              className="bg-primary-600 h-2 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${(currentStep / 4) * 100}%` }}
              transition={{ duration: 0.5 }}
            ></motion.div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-white rounded-xl shadow-lg border border-gray-200 p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {/* Step 1: Restaurant Details */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
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
                      className="pl-10 w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
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
                      className="pl-10 w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
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
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                    placeholder="Tell customers about your restaurant..."
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Branding */}
          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
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
                      className="pl-10 w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                      placeholder="https://example.com/logo.png"
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    You can add your logo URL or upload one later from the dashboard.
                  </p>
                </div>

                {formData.logo && (
                  <motion.div 
                    className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <p className="text-sm font-medium text-gray-700 mb-2">Logo Preview:</p>
                    <img 
                      src={formData.logo} 
                      alt="Restaurant logo" 
                      className="h-20 w-auto rounded-lg"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {/* Step 3: Menu Categories */}
          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Menu Categories</h2>
              <p className="text-gray-600 mb-6">
                Set up your menu categories. You can always modify these later.
              </p>
              
              <div className="space-y-4">
                {formData.categories.map((category, index) => (
                  <motion.div 
                    key={index} 
                    className="flex items-center space-x-3"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <input
                      type="text"
                      value={category}
                      onChange={(e) => handleCategoryChange(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                      placeholder="Category name"
                    />
                    {formData.categories.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeCategory(index)}
                        className="text-red-600 hover:text-red-800 px-2 py-1 transition-colors"
                      >
                        <FiX className="w-5 h-5" />
                      </button>
                    )}
                  </motion.div>
                ))}
                
                <motion.button
                  type="button"
                  onClick={addCategory}
                  className="flex items-center text-primary-600 hover:text-primary-800 font-medium transition-colors"
                  whileHover={{ scale: 1.02 }}
                >
                  <FiPlus className="mr-1" /> Add Category
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Complete Setup */}
          {currentStep === 4 && (
            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="mb-6">
                <motion.div 
                  className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <FiCheck className="w-8 h-8 text-secondary-600" />
                </motion.div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Almost Done!</h2>
                <p className="text-gray-600">
                  Your restaurant profile is ready. You can now start adding menu items and generate your QR code.
                </p>
              </div>

              <motion.div 
                className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="font-semibold text-gray-900 mb-4">What's Next?</h3>
                <ul className="text-left space-y-2 text-gray-600">
                  <motion.li 
                    className="flex items-center"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <FiCheck className="w-4 h-4 text-secondary-600 mr-2" />
                    Add your first menu items
                  </motion.li>
                  <motion.li 
                    className="flex items-center"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <FiCheck className="w-4 h-4 text-secondary-600 mr-2" />
                    Generate your restaurant's QR code
                  </motion.li>
                  <motion.li 
                    className="flex items-center"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <FiCheck className="w-4 h-4 text-secondary-600 mr-2" />
                    Print and place QR codes on tables
                  </motion.li>
                </ul>
              </motion.div>
            </motion.div>
          )}

          {/* Navigation Buttons */}
          <motion.div 
            className="flex justify-between mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              whileHover={{ scale: currentStep !== 1 ? 1.02 : 1 }}
            >
              Previous
            </motion.button>

            {currentStep < 4 ? (
              <motion.button
                onClick={nextStep}
                className="px-6 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all shadow-md hover:shadow-lg"
                whileHover={{ scale: 1.02 }}
              >
                Next
              </motion.button>
            ) : (
              <motion.button
                onClick={completeOnboarding}
                disabled={isLoading}
                className="px-6 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
              >
                {isLoading ? 'Setting up...' : 'Complete Setup'}
              </motion.button>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default OnboardingFlow;