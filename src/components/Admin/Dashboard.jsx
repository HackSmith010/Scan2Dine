import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../services/firebase';
import { menuService } from '../../services/menuService';
import { generateQRCode, downloadQRCode } from '../../utils/qrGenerator';
import MenuManager from './MenuManager';
import RestaurantSettings from './RestaurantSettings';
import ThemeCustomizer from './ThemeCustomizer';
import { 
  FiMenu, 
  FiSettings, 
  FiLogOut, 
  FiPlus, 
  FiEye,
  FiDownload,
  FiBarChart2,
  FiHome,
  FiUsers,
  FiClock
} from 'react-icons/fi';
import { FaQrcode, FaPalette } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);
  const [activeTab, setActiveTab] = useState('menu');
  const [menuItems, setMenuItems] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [qrCodeDataURL, setQrCodeDataURL] = useState('');
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);
  const [isMenuLoading, setIsMenuLoading] = useState(false);
  const [menuPreview, setMenuPreview] = useState(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      loadMenuItems();
      loadRestaurantInfo();
    }
  }, [user]);

  const loadMenuItems = async () => {
    if (!user) return;
    setIsMenuLoading(true);
    try {
      const items = await menuService.getMenuItems(user.uid);
      setMenuItems(items);
    } catch (error) {
      console.error('Error loading menu items:', error);
      toast.error('Failed to load menu items');
    } finally {
      setIsMenuLoading(false);
    }
  };

  const loadRestaurantInfo = async () => {
    if (!user) return;
    try {
      const restaurantInfo = await menuService.getRestaurant(user.uid);
      setRestaurant(restaurantInfo);
      if (restaurantInfo?.theme) {
        setMenuPreview(restaurantInfo.theme);
      }
    } catch (error) {
      console.error('Error loading restaurant info:', error);
      toast.error('Failed to load restaurant info');
    }
  };

  const handleGenerateQR = async () => {
    if (!user) return;
    
    setIsGeneratingQR(true);
    try {
      const menuUrl = `${window.location.origin}/menu/${user.uid}`;
      const qrCode = await generateQRCode(menuUrl);
      setQrCodeDataURL(qrCode);
      toast.success('QR Code generated successfully');
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast.error('Failed to generate QR code');
    } finally {
      setIsGeneratingQR(false);
    }
  };

  const handleDownloadQR = () => {
    if (qrCodeDataURL) {
      downloadQRCode(qrCodeDataURL, `${restaurant?.name || 'restaurant'}-menu-qr`);
      toast.success('QR Code downloaded');
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/');
      toast.info('Logged out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to logout');
    }
  };

  const handleThemeUpdate = async (newTheme) => {
    try {
      await menuService.updateRestaurantTheme(user.uid, newTheme);
      setMenuPreview(newTheme);
      toast.success('Theme updated successfully');
    } catch (error) {
      console.error('Error updating theme:', error);
      toast.error('Failed to update theme');
    }
  };

  const menuUrl = user ? `${window.location.origin}/menu/${user.uid}` : '';

  const stats = [
    {
      label: 'Menu Items',
      value: menuItems.length,
      icon: <FiMenu className="w-5 h-5" />,
      color: 'from-blue-500 to-blue-600'
    },
    {
      label: 'Categories',
      value: [...new Set(menuItems.map(item => item.category))].length,
      icon: <FiBarChart2 className="w-5 h-5" />,
      color: 'from-secondary-500 to-secondary-600'
    },
    {
      label: 'Today Views',
      value: '124',
      icon: <FiEye className="w-5 h-5" />,
      color: 'from-primary-500 to-primary-600'
    },
    {
      label: 'Total Views',
      value: '1,842',
      icon: <FiUsers className="w-5 h-5" />,
      color: 'from-purple-500 to-purple-600'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar Navigation */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4 mb-8">
              <FaQrcode className="w-8 h-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Scan2Dine</span>
            </div>
            <nav className="flex-1 px-2 space-y-1">
              <button
                onClick={() => setActiveTab('menu')}
                className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg w-full ${
                  activeTab === 'menu'
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <FiMenu className="mr-3 flex-shrink-0 h-5 w-5" />
                Menu Management
              </button>
              <button
                onClick={() => setActiveTab('qr')}
                className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg w-full ${
                  activeTab === 'qr'
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <FaQrcode className="mr-3 flex-shrink-0 h-5 w-5" />
                QR Codes
              </button>
              <button
                onClick={() => setActiveTab('theme')}
                className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg w-full ${
                  activeTab === 'theme'
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <FaPalette className="mr-3 flex-shrink-0 h-5 w-5" />
                Menu Theme
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg w-full ${
                  activeTab === 'settings'
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <FiSettings className="mr-3 flex-shrink-0 h-5 w-5" />
                Restaurant Settings
              </button>
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <button
              onClick={handleLogout}
              className="flex-shrink-0 w-full group block"
            >
              <div className="flex items-center">
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                    Sign out
                  </p>
                </div>
                <FiLogOut className="ml-auto h-5 w-5 text-gray-500 group-hover:text-gray-700" />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="md:pl-64 flex flex-col">
        {/* Mobile header */}
        <div className="md:hidden sticky top-0 z-10 bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center">
              <FaQrcode className="w-6 h-6 text-primary-600" />
              <span className="ml-2 text-lg font-bold text-gray-900">Scan2Dine</span>
            </div>
            <button
              onClick={handleLogout}
              className="text-gray-600 hover:text-gray-900"
            >
              <FiLogOut className="h-5 w-5" />
            </button>
          </div>
          <div className="px-4 pb-3 flex overflow-x-auto space-x-4">
            {[
              { key: 'menu', icon: <FiMenu className="w-4 h-4" /> },
              { key: 'qr', icon: <FaQrcode className="w-4 h-4" /> },
              { key: 'theme', icon: <FaPalette className="w-4 h-4" /> },
              { key: 'settings', icon: <FiSettings className="w-4 h-4" /> }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-3 py-2 text-sm font-medium rounded-md flex items-center ${
                  activeTab === tab.key
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {tab.icon}
                <span className="ml-1 capitalize">{tab.key}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Desktop header */}
        <header className="hidden md:block bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {restaurant?.name || 'Your Restaurant'}
                </h1>
                <p className="text-gray-600">Dashboard</p>
              </div>
              
              <div className="flex items-center space-x-4">
                <a
                  href={menuUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 bg-primary-50 px-4 py-2 rounded-lg"
                >
                  <FiEye className="w-4 h-4" />
                  <span>View Menu</span>
                </a>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Welcome Banner */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl shadow-lg p-6 mb-8 text-white"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Welcome back, {restaurant?.ownerName || 'Admin'}!</h2>
                  <p className="opacity-90">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                <div className="mt-4 md:mt-0 flex items-center space-x-2">
                  <FiClock className="w-5 h-5" />
                  <span>{new Date().toLocaleTimeString()}</span>
                </div>
              </div>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-white rounded-xl shadow p-6 bg-gradient-to-br ${stat.color} text-white`}
                >
                  <div className="flex items-center">
                    <div className="p-2 rounded-lg bg-white bg-opacity-20">
                      {stat.icon}
                    </div>
                    <div className="ml-4">
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-sm opacity-90">{stat.label}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Mobile tab indicator */}
              <div className="md:hidden px-4 pt-4">
                <h2 className="text-xl font-bold text-gray-900 capitalize">
                  {activeTab === 'menu' && 'Menu Management'}
                  {activeTab === 'qr' && 'QR Codes'}
                  {activeTab === 'theme' && 'Menu Theme'}
                  {activeTab === 'settings' && 'Restaurant Settings'}
                </h2>
              </div>

              <div className="p-6">
                {/* Menu Management Tab */}
                {activeTab === 'menu' && (
                  <MenuManager 
                    menuItems={menuItems}
                    onMenuUpdate={loadMenuItems}
                    restaurantId={user?.uid}
                    isLoading={isMenuLoading}
                  />
                )}

                {/* QR Code Tab */}
                {activeTab === 'qr' && (
                  <div className="max-w-2xl mx-auto">
                    <div className="text-center mb-8">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Your Digital Menu QR Code
                      </h3>
                      <p className="text-gray-600">
                        Generate and download QR codes for your restaurant tables
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6 mb-6 border border-gray-200">
                      <h4 className="font-medium text-gray-900 mb-2">Menu URL:</h4>
                      <div className="bg-white rounded-lg border p-3 mb-4 overflow-x-auto">
                        <code className="text-sm text-gray-700 break-all">{menuUrl}</code>
                      </div>
                      
                      <button
                        onClick={handleGenerateQR}
                        disabled={isGeneratingQR}
                        className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-3 rounded-lg hover:from-primary-600 hover:to-secondary-600 disabled:opacity-50 flex items-center justify-center space-x-2 transition-all shadow-md hover:shadow-lg"
                      >
                        <FaQrcode className="w-5 h-5" />
                        <span>{isGeneratingQR ? 'Generating...' : 'Generate QR Code'}</span>
                      </button>
                    </div>

                    {qrCodeDataURL && (
                      <motion.div 
                        className="text-center bg-white border rounded-xl p-6 shadow-sm"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <img 
                          src={qrCodeDataURL} 
                          alt="Menu QR Code" 
                          className="mx-auto mb-6 border rounded-lg w-48 h-48"
                        />
                        <div className="flex flex-col sm:flex-row justify-center gap-3">
                          <button
                            onClick={handleDownloadQR}
                            className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 flex items-center justify-center space-x-2 transition-colors"
                          >
                            <FiDownload className="w-4 h-4" />
                            <span>Download PNG</span>
                          </button>
                          <button className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 flex items-center justify-center space-x-2 transition-colors">
                            <FiDownload className="w-4 h-4" />
                            <span>Download PDF</span>
                          </button>
                        </div>
                        <p className="mt-4 text-sm text-gray-500">
                          Print and place these QR codes on your tables for customers to scan
                        </p>
                      </motion.div>
                    )}
                  </div>
                )}

                {/* Theme Customizer Tab */}
                {activeTab === 'theme' && (
                  <ThemeCustomizer
                    currentTheme={menuPreview}
                    onThemeUpdate={handleThemeUpdate}
                    restaurantName={restaurant?.name}
                  />
                )}

                {/* Settings Tab */}
                {activeTab === 'settings' && (
                  <RestaurantSettings 
                    restaurant={restaurant}
                    onUpdate={loadRestaurantInfo}
                    restaurantId={user?.uid}
                  />
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;