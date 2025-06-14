import { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import MenuItem from './MenuItem';

const MenuCategory = ({ category, items, onOrderClick }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-4 flex items-center justify-between hover:from-primary-600 hover:to-primary-700 transition-all"
      >
        <div className="flex items-center space-x-3">
          <h2 className="text-xl font-semibold">{category}</h2>
          <span className="bg-white/20 text-white px-2 py-1 rounded-full text-sm">
            {items.length} {items.length === 1 ? 'item' : 'items'}
          </span>
        </div>
        {isExpanded ? (
          <FiChevronUp className="w-5 h-5" />
        ) : (
          <FiChevronDown className="w-5 h-5" />
        )}
      </button>

      <div className={`transition-all duration-300 ease-in-out ${
        isExpanded 
          ? 'max-h-[2000px] opacity-100' 
          : 'max-h-0 opacity-0'
      }`}>
        <div className="p-6">
          <div className="grid gap-4">
            {items.map((item, index) => (
              <MenuItem
                key={item.id}
                item={item}
                onOrderClick={onOrderClick}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuCategory;