import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { menuService } from '../../services/menuService';
import MenuCategory from './MenuCategory';
import { FiMapPin, FiPhone, FiMessageSquare } from 'react-icons/fi';

const MenuDisplay = () => {
  const { restaurantId } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadMenuData();
  }, [restaurantId]);

  const loadMenuData = async () => {
    try {
      const [restaurantData, menuData] = await Promise.all([
        menuService.getRestaurant(restaurantId),
        menuService.getMenuItems(restaurantId)
      ]);

      setRestaurant(restaurantData);
      setMenuItems(menuData);
    } catch (err) {
      console.error('Error loading menu data:', err);
      setError('Unable to load menu. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const groupedItems = menuItems.reduce((groups, item) => {
    const category = item.category || 'Other';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(item);
    return groups;
  }, {});

  const createWhatsAppMessage = (item) => {
    const message = `Hi! I'd like to order: ${item.name} ($${item.price.toFixed(2)}) from ${restaurant.name}`;
    return `https://wa.me/${restaurant.phone?.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading menu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Menu Not Available</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-gray-400 text-6xl mb-4">🍽️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Restaurant Not Found</h2>
          <p className="text-gray-600">The restaurant you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Restaurant Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
            {restaurant.logo && (
              <img
                src={restaurant.logo}
                alt={`${restaurant.name} logo`}
                className="w-16 h-16 rounded-lg object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            )}
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {restaurant.name}
              </h1>
              {restaurant.description && (
                <p className="text-gray-600 mt-1">{restaurant.description}</p>
              )}
              <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                {restaurant.address && (
                  <div className="flex items-center space-x-1">
                    <FiMapPin className="w-4 h-4" />
                    <span>{restaurant.address}</span>
                  </div>
                )}
                {restaurant.phone && (
                  <div className="flex items-center space-x-1">
                    <FiPhone className="w-4 h-4" />
                    <span>{restaurant.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {Object.keys(groupedItems).length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <div className="text-gray-400 text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Menu Coming Soon</h3>
            <p className="text-gray-600">
              We're working hard to get our menu ready. Please check back soon!
            </p>
          </div>
        ) : (
          <div className="space-y-8 animate-fade-in">
            {Object.entries(groupedItems).map(([category, items]) => (
              <MenuCategory
                key={category}
                category={category}
                items={items}
                onOrderClick={restaurant.phone ? createWhatsAppMessage : null}
              />
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>Powered by Scan2Dine</p>
        </div>
      </div>
    </div>
  );
};

export default MenuDisplay;