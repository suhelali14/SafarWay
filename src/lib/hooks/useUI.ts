import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import {
  setTheme,
  toggleSidebar,
  toggleMobileMenu,
  toggleSearch,
  addNotification,
  removeNotification,
  clearNotifications,
  openModal,
  closeModal,
  setLoading,
} from '../store/slices/uiSlice';
import { useCallback } from 'react';

export const useUI = () => {
  const dispatch = useDispatch();
  const {
    theme,
    sidebarOpen,
    mobileMenuOpen,
    searchOpen,
    notifications,
    modals,
    loading,
  } = useSelector((state: RootState) => state.ui);

  const handleSetTheme = useCallback(
    (theme: 'light' | 'dark') => {
      dispatch(setTheme(theme));
    },
    [dispatch]
  );

  const handleToggleSidebar = useCallback(() => {
    dispatch(toggleSidebar());
  }, [dispatch]);

  const handleToggleMobileMenu = useCallback(() => {
    dispatch(toggleMobileMenu());
  }, [dispatch]);

  const handleToggleSearch = useCallback(() => {
    dispatch(toggleSearch());
  }, [dispatch]);

  const handleAddNotification = useCallback(
    (notification: { type: 'success' | 'error' | 'info' | 'warning'; message: string; duration?: number }) => {
      dispatch(addNotification(notification));
      if (notification.duration) {
        setTimeout(() => {
          dispatch(removeNotification(notification.message));
        }, notification.duration);
      }
    },
    [dispatch]
  );

  const handleRemoveNotification = useCallback(
    (id: string) => {
      dispatch(removeNotification(id));
    },
    [dispatch]
  );

  const handleClearNotifications = useCallback(() => {
    dispatch(clearNotifications());
  }, [dispatch]);

  const handleOpenModal = useCallback(
    (modalId: string) => {
      dispatch(openModal(modalId));
    },
    [dispatch]
  );

  const handleCloseModal = useCallback(
    (modalId: string) => {
      dispatch(closeModal(modalId));
    },
    [dispatch]
  );

  const handleSetLoading = useCallback(
    (key: string, value: boolean) => {
      dispatch(setLoading({ key, value }));
    },
    [dispatch]
  );

  return {
    theme,
    sidebarOpen,
    mobileMenuOpen,
    searchOpen,
    notifications,
    modals,
    loading,
    setTheme: handleSetTheme,
    toggleSidebar: handleToggleSidebar,
    toggleMobileMenu: handleToggleMobileMenu,
    toggleSearch: handleToggleSearch,
    addNotification: handleAddNotification,
    removeNotification: handleRemoveNotification,
    clearNotifications: handleClearNotifications,
    openModal: handleOpenModal,
    closeModal: handleCloseModal,
    setLoading: handleSetLoading,
  };
}; 