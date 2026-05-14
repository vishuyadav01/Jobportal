import React from 'react';
import { FiAlertTriangle, FiX } from 'react-icons/fi';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content animate-scale-in max-w-md">
        <div className="flex items-center justify-between mb-6">
          <div className="p-3 bg-red-100 text-red-600 rounded-2xl">
            <FiAlertTriangle size={24} />
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
            <FiX size={20} className="text-slate-400" />
          </button>
        </div>

        <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
        <p className="text-slate-500 mb-8 leading-relaxed">
          {message}
        </p>

        <div className="flex items-center gap-4">
          <button onClick={onClose} className="btn-secondary flex-1">
            Cancel
          </button>
          <button onClick={onConfirm} className="btn-danger flex-1">
            Delete Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
