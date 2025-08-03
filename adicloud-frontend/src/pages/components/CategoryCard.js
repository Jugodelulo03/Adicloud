import React from 'react';
import './CategoryCard.css';

function CategoryCard({ categories, categoryFilter, setCategoryFilter }) {
  return (
    <div className="CategoryCard">
      <button
        className={`all-category-button ${categoryFilter === '' ? 'category-button active' : 'category-button'}`}
        onClick={() => setCategoryFilter('')} 
      >
        All Categories
      </button>

      {categories.map((cat, idx) => (
        <button
          key={idx}
          className={categoryFilter === cat.name ? 'category-button active' : 'category-button'}
          onClick={() => setCategoryFilter(cat.name)} 
        >
          {cat.previewImage && (
            <img
              src={cat.previewImage}
              alt={cat.name}
              className="category-image"
            />
          )}
          {cat.name}
        </button>
      ))}
    </div>
  );
}

export default CategoryCard;