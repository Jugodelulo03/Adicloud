import React, { Component } from "react";
import './RequestCard.css';

function RequestCard({request, onApprove, onReject}){

    return(
        <li className="request-card">
            <img
                src={request.assetId?.files[0]}
                alt={request.assetId?.name}
                className="imgRequest"
            />
            <div className="infoRequest">
                <div className="">
                    <p className="nameAsset">{request.assetId?.name} </p>
                    <p>{request.assetId?.files?.length} files</p>
                    <p>To:{request.userId?.name}</p>
                    <p>Purpose: {request.purpose}</p>
                    <p>Requested: {new Date(request.createdAt).toLocaleDateString()}</p>
                    <p>Deadline: {new Date(request.deadline).toLocaleDateString()}</p>
                </div>
                <div className="divider"></div>
                <div className="rightpanel">
                    <p className={`status-text ${request.status}`}>{request.status}</p>
                    {request.status === 'Pending' && (
                        <div className="request-actions">
                            <button onClick={() => onApprove(request._id)} className="bottonRequest">Approve</button>
                            <button onClick={() => onReject(request._id)} className="bottonRequest">Reject</button>
                        </div>
                    )}
                </div>

            </div>
        </li>
    );
}

export default RequestCard;