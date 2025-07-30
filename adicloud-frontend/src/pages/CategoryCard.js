import React from "react";
/*import './Components.css';*/

const CatergoryCard = ({imgSrc}, title) => {
    return(
        <div className="catgory">
            <img src={imgSrc} alt={title} />
            <h3>{title}</h3>
        </div>
    )
}

export default CatergoryCard;