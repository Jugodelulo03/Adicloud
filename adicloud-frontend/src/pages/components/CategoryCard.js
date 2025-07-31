import React from "react";
/*import './Components.css';*/

function CategoryCard({ category, onSelect }) {
  return (
    <div className="category-card" onClick={() => onSelect(category.name)}>
      <img src={category.imageUrl/**/} alt={category.name} className="category-image" />
      <p>{category.name}</p>
    </div>
  );
}

export default CategoryCard;