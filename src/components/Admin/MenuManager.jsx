import { useState } from 'react';
import { menuService } from '../../services/menuService';
import { FiPlus, FiEdit, FiTrash2, FiDollarSign, FiTag, FiImage } from 'react-icons/fi';

const MenuManager = ({ menuItems, onMenuUpdate, restaurantId }) => {
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'Starters',
    description: '',
    imageUrl: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const categories = ['Starters', 'Main Course', 'Desserts', 'Drinks', 'Specials'];

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      category: 'Starters',
      description: '',
      imageUrl: ''
    });
    setIsAddingItem(false);
    setEditingItem(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!restaurantId) return;

    setIsLoading(true);
    try {
      const itemData = {
        ...formData,
        price: parseFloat(formData.price)
      };

      if (editingItem) {
        await menuService.updateMenuItem(editingItem.id, itemData);
      } else {
        await menuService.addMenuItem(restaurantId, itemData);
      }

      await onMenuUpdate();
      resetForm();
    } catch (error) {
      console.error('Error saving menu item:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      name: item.name,
      price: item.price.toString(),
      category: item.category,
      description: item.description || '',
      imageUrl: item.imageUrl || ''
    });
    setEditingItem(item);
    setIsAddingItem(true);
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    setIsLoading(true);
    try {
      await menuService.deleteMenuItem(itemId);
      await onMenuUpdate();
    } catch (error) {
      console.error('Error deleting menu item:', error);
    } finally {
      setIsLoading(false);
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

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Menu Items</h3>
          <p className="text-gray-600">Manage your restaurant's menu items</p>
        </div>
        <button
          onClick={() => setIsAddingItem(true)}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center space-x-2"
        >
          <FiPlus className="w-4 h-4" />
          <span>Add Item</span>
        </button>
      </div>

      {/* Add/Edit Form */}
      {isAddingItem && (
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">
            {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
          </h4>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Item Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter item name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price *
              </label>
              <div className="relative">
                <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <div className="relative">
                <FiTag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image URL (Optional)
              </label>
              <div className="relative">
                <FiImage className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Describe the item..."
              />
            </div>

            <div className="md:col-span-2 flex justify-end space-x-3">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : editingItem ? 'Update Item' : 'Add Item'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Menu Items by Category */}
      {Object.keys(groupedItems).length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <FiPlus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No menu items yet</h3>
          <p className="text-gray-600 mb-4">Start building your menu by adding your first item</p>
          <button
            onClick={() => setIsAddingItem(true)}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
          >
            Add First Item
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedItems).map(([category, items]) => (
            <div key={category}>
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FiTag className="w-5 h-5 mr-2 text-primary-600" />
                {category} ({items.length})
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((item) => (
                  <div key={item.id} className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-32 object-cover rounded-lg mb-3"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    )}
                    
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-semibold text-gray-900">{item.name}</h5>
                      <span className="text-primary-600 font-bold">${item.price.toFixed(2)}</span>
                    </div>
                    
                    {item.description && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
                    )}
                    
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-600 hover:text-blue-800 p-1"
                        title="Edit item"
                      >
                        <FiEdit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-800 p-1"
                        title="Delete item"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuManager;