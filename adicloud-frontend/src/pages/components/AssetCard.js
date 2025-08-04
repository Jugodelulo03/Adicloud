import React, { Component } from "react";
import './AssetCard.css';

function AssetCard({ asset }){
    return(
        <li className="AssetConteiner">
            {/* Display the first file as the main preview image, if available */}
            {asset.files.length > 0 && (
                <img
                    src={asset.files[0]}
                    alt={asset.name}
                    className="prevasset"
                />
            )}
            {/* Display the second file as a hover image, if it exists */}{/* Display the second file as a hover image, if it exists */}
            {asset.files.length > 1 && (
                <img
                src={asset.files[1]}
                alt={asset.name + ' hover'}
                className="hoverImage"
                />
            )}
            <div className="ConteinerInfoAssets">
                <div className="AssetTitle">
                    {asset.name}
                </div>
                <span>{asset.files.length} files</span>
            </div>
        </li>
    );
}

export default AssetCard;