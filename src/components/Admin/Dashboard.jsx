import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../services/firebase';
import { menuService } from '../../services/menuService';
import { generateQRCode, downloadQRCode } from '../../utils/qrGenerator';
import MenuManager from './MenuManager';
import RestaurantSettings from './RestaurantSettings';
import { 
  FiMenu, 
  FiSettings, 
  FiLogOut, 
  FiPlus, 
  FiEye,
  FiDownload,
  FiBarChart2
} from 'react-icons/fi';
import { FaQrcode } from 'react-icons/fa';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);
  const [activeTab, setActiveTab] = useState('menu');
  const [menuItems, setMenuItems] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [qrCodeDataURL, setQrCodeDataURL] = useState('');
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);

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
    try {
      const items = await menuService.getMenuItems(user.uid);
      setMenuItems(items);
    } catch (error) {
      console.error('Error loading menu items:', error);
    }
  };

  const loadRestaurantInfo = async () => {
    if (!user) return;
    try {
      const restaurantInfo = await menuService.getRestaurant(user.uid);
      setRestaurant(restaurantInfo);
    } catch (error) {
      console.error('Error loading restaurant info:', error);
    }
  };

  const handleGenerateQR = async () => {
    if (!user) return;
    
    setIsGeneratingQR(true);
    try {
      const menuUrl = `${window.location.origin}/menu/${user.uid}`;
      const qrCode = await generateQRCode(menuUrl);
      setQrCodeDataURL(qrCode);
    } catch (error) {
      console.error('Error generating QR code:', error);
    } finally {
      setIsGeneratingQR(false);
    }
  };

  const handleDownloadQR = () => {
    if (qrCodeDataURL) {
      downloadQRCode(qrCodeDataURL, `${restaurant?.name || 'restaurant'}-menu-qr`);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const menuUrl = user ? `${window.location.origin}/menu/${user.uid}` : '';

  const stats = [
    {
      label: 'Total Items',
      value: menuItems.length,
      icon: <FiMenu className="w-6 h-6" />,
      color: 'bg-blue-500'
    },
    {
      label: 'Categories',
      value: [...new Set(menuItems.map(item => item.category))].length,
      icon: <FiBarChart2 className="w-6 h-6" />,
      color: 'bg-secondary-500'
    },
    {
      label: 'Menu Views',
      value: '124', // Mock data
      icon: <FiEye className="w-6 h-6" />,
      color: 'bg-primary-500'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {restaurant?.name || 'Your Restaurant'}
              </h1>
              <p className="text-gray-600">Restaurant Dashboard</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <a
                href={menuUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-primary-600 hover:text-primary-700"
              >
                <FiEye className="w-4 h-4" />
                <span>View Menu</span>
              </a>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <FiLogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className={`${stat.color} text-white p-3 rounded-lg`}>
                  {stat.icon}
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-gray-600">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { key: 'menu', label: 'Menu Management', icon: <FiMenu className="w-4 h-4" /> },
                { key: 'qr', label: 'QR Code', icon: <FaQrcode className="w-4 h-4" /> },
                { key: 'settings', label: 'Settings', icon: <FiSettings className="w-4 h-4" /> }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.key
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Menu Management Tab */}
            {activeTab === 'menu' && (
              <MenuManager 
                menuItems={menuItems}
                onMenuUpdate={loadMenuItems}
                restaurantId={user?.uid}
              />
            )}

            {/* QR Code Tab */}
            {activeTab === 'qr' && (
              <div className="max-w-2xl">
                <div className="text-center mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Your Menu QR Code
                  </h3>
                  <p className="text-gray-600">
                    Generate and download QR codes for your restaurant tables
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <h4 className="font-medium text-gray-900 mb-2">Menu URL:</h4>
                  <div className="bg-white rounded border p-3 mb-4">
                    <code className="text-sm text-gray-700 break-all">{menuUrl}</code>
                  </div>
                  
                  <button
                    onClick={handleGenerateQR}
                    disabled={isGeneratingQR}
                    className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 disabled:opacity-50 flex items-center space-x-2"
                  >
                    <FiQrCode className="w-4 h-4" />
                    <span>{isGeneratingQR ? 'Generating...' : 'Generate QR Code'}</span>
                  </button>
                </div>

                {qrCodeDataURL && (
                  <div className="text-center bg-white border rounded-lg p-6">
                    <img 
                      src={qrCodeDataURL} 
                      alt="Menu QR Code" 
                      className="mx-auto mb-4 border rounded-lg"
                    />
                    <button
                      onClick={handleDownloadQR}
                      className="bg-secondary-600 text-white px-6 py-2 rounded-lg hover:bg-secondary-700 flex items-center space-x-2 mx-auto"
                    >
                      <FiDownload className="w-4 h-4" />
                      <span>Download QR Code</span>
                    </button>
                  </div>
                )}
              </div>
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
    </div>
  );
};

export default Dashboard;