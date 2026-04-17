import { useState } from 'react';

const useNotification = () => {
  const [notification, setNotification] = useState({
    type: 'success',
    message: '',
    isVisible: false
  });

  const showNotification = (type, message) => {
    setNotification({
      type,
      message,
      isVisible: true
    });
  };

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, isVisible: false }));
  };

  const showSuccess = (message) => {
    showNotification('success', message);
  };

  const showError = (message) => {
    showNotification('error', message);
  };

  const showWarning = (message) => {
    showNotification('warning', message);
  };

  const showInfo = (message) => {
    showNotification('info', message);
  };

  return {
    notification,
    showNotification,
    hideNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
};

export default useNotification;
