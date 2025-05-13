"use client"

import React from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'warning' | 'info' | 'error' | 'success';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'info'
}) => {
  if (!isOpen) return null;

  const getBgColor = () => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-50';
      case 'error':
        return 'bg-red-50';
      case 'success':
        return 'bg-green-50';
      default:
        return 'bg-blue-50';
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'warning':
        return 'text-yellow-600';
      case 'error':
        return 'text-red-600';
      case 'success':
        return 'text-green-600';
      default:
        return 'text-blue-600';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 cursor-pointer" onClick={onClose} />
      
      {/* Modal */}
      <div className={`relative ${getBgColor()} p-6 rounded-lg shadow-xl max-w-md w-full mx-4 transform transition-all cursor-default`}>
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Content */}
        <div className="mt-3 text-center sm:mt-0 sm:text-left">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-2">{title}</h3>
          <div className="mt-2">
            <p className="text-sm text-gray-500">{description}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-2">
          {onConfirm && (
            <Button
              variant={type === 'warning' ? 'destructive' : 'primary'}
              onClick={onConfirm}
              className='cursor-pointer'
            >
              {confirmText}
            </Button>
          )}
          <Button className='cursor-pointer' variant="secondary" onClick={onClose}>
            {cancelText}
          </Button>
        </div>
      </div>
    </div>
  );
};
