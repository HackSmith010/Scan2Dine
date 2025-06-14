import { FiMessageSquare } from 'react-icons/fi';

const MenuItem = ({ item, onOrderClick, delay = 0 }) => {
  const handleOrderClick = () => {
    if (onOrderClick) {
      const whatsappUrl = onOrderClick(item);
      window.open(whatsappUrl, '_blank');
    }
  };

  return (
    <div 
      className="flex flex-col sm:flex-row bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-all duration-200 animate-fade-in"
      style={{ animationDelay: `${delay}s` }}
    >
      {/* Item Image */}
      {item.imageUrl && (
        <div className="w-full sm:w-24 h-32 sm:h-24 mb-4 sm:mb-0 sm:mr-4 flex-shrink-0">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover rounded-lg"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
      )}

      {/* Item Details */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between">
          <div className="flex-1 mb-3 sm:mb-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {item.name}
            </h3>
            {item.description && (
              <p className="text-gray-600 text-sm leading-relaxed">
                {item.description}
              </p>
            )}
          </div>
          
          <div className="flex items-center justify-between sm:flex-col sm:items-end sm:ml-4">
            <span className="text-xl font-bold text-primary-600">
              ${item.price.toFixed(2)}
            </span>
            
            {onOrderClick && (
              <button
                onClick={handleOrderClick}
                className="ml-3 sm:ml-0 sm:mt-2 bg-secondary-600 text-white px-4 py-2 rounded-lg hover:bg-secondary-700 transition-colors flex items-center space-x-2 text-sm font-medium"
              >
                <FiMessageSquare className="w-4 h-4" />
                <span>Order on WhatsApp</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuItem;