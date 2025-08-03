import React, {useState} from "react";
import './RequestCard.css';
import ConfirmationPopup from './ConfirmationPopUp.js';

function RequestCard({ request, onApprove, onReject , onDownload }) {
  const role = localStorage.getItem("role");

  const isAdmin = role === "admin";
  const isUser = role === "user";

  const isApproved = request.status === "Approved";
  const isPending = request.status === "Pending";

  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const handleConfirm = () => {
    if (confirmAction === 'approve') {
      onApprove(request._id);
    } else if (confirmAction === 'reject') {
      onReject(request._id);
    }
    setConfirmVisible(false);
    setConfirmAction(null);
  };

  const handleCancel = () => {
    setConfirmVisible(false);
    setConfirmAction(null);
  };
  return (
    <li className="request-card">
      <img
        src={request.assetId?.files[0]}
        alt={request.assetId?.name}
        className="imgRequest"
      />
      <div className="infoRequest">
        <div>
          <p className="nameAsset"> <strong>{request.assetId?.name}</strong></p>
          <p>{request.assetId?.files?.length} files</p>
          {!isUser && (
            <>
              <p> <strong>To:</strong> {request.userId?.name}</p>
              <p> <strong>Purpose: </strong>{request.purpose}</p>
            </>
          )}
          <p> <strong>Requested: </strong>{new Date(request.createdAt).toLocaleDateString()}</p>
          <p> <strong>Deadline: </strong> {new Date(request.deadline).toLocaleDateString()}</p>
        </div>
        <div className="divider"></div>
        <div className="rightpanel">
          <p className={`status-text ${request.status}`}>{request.status}</p>

          {isAdmin && isPending && (
            <div className="request-actions">
              <button
                onClick={() => {
                  setConfirmAction('approve');
                  setConfirmVisible(true);
                }}
                className="bottonRequest"
              >
                Approve
              </button>
              <button
                onClick={() => {
                  setConfirmAction('reject');
                  setConfirmVisible(true);
                }}
                className="bottonRequest"
              >
                Reject
              </button>
            </div>
          )}

          {confirmVisible &&(
             <ConfirmationPopup
                message={
                  confirmAction === 'approve'
                    ? 'Are you sure you want to APPROVE this request?'
                    : 'Are you sure you want to REJECT this request?'
                }
                onConfirm={handleConfirm}
                onCancel={handleCancel}
              />
          )}

          {isUser && isApproved && (
        <button onClick={onDownload} className="bottonRequest">
            Download
        </button>
        )}
        </div>
      </div>
    </li>
  );
}

export default RequestCard;
