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
                <div className="text">
                    <p className="nameAsset">{request.assetId?.name} </p>
                    <p>{request.assetId?.files?.length} files</p>
                    <p>To:{request.userId?.name}</p>
                    <p>Purpose: {request.purpose}</p>
                    <p>Requested: {new Date(request.createdAt).toLocaleDateString()}</p>
                    <p>Deadline: {new Date(request.deadline).toLocaleDateString()}</p>
                </div>

                <div className="rightpanel">
                    {request.status === 'Approved' && (
                        <p className="Blue">{request.status}</p>
                    )} 
                    {request.status === 'Rejected' && (
                        <p className="Red">{request.status}</p>
                    )} 
                    {request.status === 'Pending' && (
                        <p className="normal">{request.status}</p>
                    )}

                    {request.status === 'Pending' && (
                        <div className="request-actions">
                            <button onClick={() => onApprove(request._id)}>Approve</button>
                            <button onClick={() => onReject(request._id)}>Reject</button>
                        </div>
                    )}
                </div>

            </div>
        </li>
    );
}

export default RequestCard;