import React from 'react';
import './CategoryCard.css';




function CategoryCard({ categories, categoryFilter, setCategoryFilter }) {
  return (
    <div className="CategoryCard">
      <button
        className={categoryFilter === '' ? 'category-button active' : 'category-button'}
        onClick={() => setCategoryFilter('')}
      >
        All Categories
      </button>

      {categories.map((cat, idx) => (

        <button
          key={idx}
          className={categoryFilter === cat ? 'category-button active' : 'category-button'}
          onClick={() => setCategoryFilter(cat)}
        >
          <img src={cat.image} alt={cat.name} className="category-image" />
          {cat}
        </button>
      ))}
    </div>
  );
}

export default CategoryCard;
