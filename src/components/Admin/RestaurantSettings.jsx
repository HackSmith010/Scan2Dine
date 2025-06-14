import { useState } from 'react';
import { menuService } from '../../services/menuService';
import { FiSave, FiMapPin, FiPhone, FiMail, FiImage } from 'react-icons/fi';

const RestaurantSettings = ({ restaurant, onUpdate, restaurantId }) => {
  const [formData, setFormData] = useState({
    name: restaurant?.name || '',
    address: restaurant?.address || '',
    phone: restaurant?.phone || '',
    description: restaurant?.description || '',
    logo: restaurant?.logo || ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (message) setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!restaurantId) return;

    setIsLoading(true);
    try {
      await menuService.updateRestaurant(restaurantId, formData);
      await onUpdate();
      setMessage('Restaurant settings updated successfully!');
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error updating restaurant:', error);
      setMessage('Error updating settings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Restaurant Settings</h3>
        <p className="text-gray-600">Update your restaurant information</p>
      </div>

      {message && (
        <div className={`p-4 rounded-lg mb-6 ${
          message.includes('Error') 
            ? 'bg-red-50 text-red-700 border border-red-200' 
            : 'bg-green-50 text-green-700 border border-green-200'
        }`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Restaurant Name *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Enter restaurant name"
          />
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
            Address
          </label>
          <div className="relative">
            <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              id="address"
              name="address"
              type="text"
              value={formData.address}
              onChange={handleChange}
              className="pl-10 w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter restaurant address"
            />
          </div>
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <div className="relative">
            <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              className="pl-10 w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter phone number"
            />
          </div>
        </div>

        <div>
          <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-2">
            Logo URL
          </label>
          <div className="relative">
            <FiImage className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              id="logo"
              name="logo"
              type="url"
              value={formData.logo}
              onChange={handleChange}
              className="pl-10 w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="https://example.com/logo.png"
            />
          </div>
          {formData.logo && (
            <div className="mt-3">
              <img 
                src={formData.logo} 
                alt="Restaurant logo" 
                className="h-16 w-auto rounded-lg border"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Tell customers about your restaurant..."
          />
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Menu URL</h4>
          <p className="text-sm text-gray-600 mb-2">
            This is the URL customers will see when they scan your QR code:
          </p>
          <div className="bg-white rounded border p-3">
            <code className="text-sm text-gray-700 break-all">
              {window.location.origin}/menu/{restaurantId}
            </code>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 disabled:opacity-50 flex items-center space-x-2"
          >
            <FiSave className="w-4 h-4" />
            <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default RestaurantSettings;