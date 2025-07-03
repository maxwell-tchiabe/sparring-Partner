'use client';

import {
  Notification,
  NotificationType,
} from '@/components/common/Notification';
import React, { createContext, useCallback, useContext, useState } from 'react';

interface NotificationContextType {
  showNotification: (type: NotificationType, message: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [show, setShow] = useState(false);
  const [type, setType] = useState<NotificationType>('info');
  const [message, setMessage] = useState('');

  const showNotification = useCallback(
    (newType: NotificationType, newMessage: string) => {
      setType(newType);
      setMessage(newMessage);
      setShow(true);
    },
    []
  );

  const handleClose = () => {
    setShow(false);
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <Notification
        show={show}
        type={type}
        message={message}
        onClose={handleClose}
      />
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      'useNotification must be used within a NotificationProvider'
    );
  }
  return context;
};
