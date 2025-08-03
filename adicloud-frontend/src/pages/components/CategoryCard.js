import React from 'react';
import './CategoryCard.css';

function CategoryCard({ categories, categoryFilter, setCategoryFilter }) {
  return (
    <div className="CategoryCard">
      <button
        className={`all-category-button ${categoryFilter === '' ? 'category-button active' : 'category-button'}`}
        onClick={() => setCategoryFilter('')} 
      >
        <div className='textbuttonCC'>

          All Categories
        </div>

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
          <div className='textbuttonCC'>
            {cat.name}
          </div>
        </button>
      ))}
    </div>
  );
}

export default CategoryCard;