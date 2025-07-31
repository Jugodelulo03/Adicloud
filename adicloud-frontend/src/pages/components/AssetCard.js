import React, { Component } from "react";
import './AssetCard.css';

function AssetCard({ asset }){
    return(
        <li className="AssetConteiner">
            {asset.files.length > 0 && (
                <img
                    src={asset.files[0]}
                    alt={asset.name}
                    className="prevasset"
                />
            )}
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