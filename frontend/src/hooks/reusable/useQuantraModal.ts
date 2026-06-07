import { useState, useCallback } from 'react';

export function useQuantraModal(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState);

  const handleOpenModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleToggleModal = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return {
    isOpen,
    handleOpenModal,
    handleCloseModal,
    handleToggleModal,
  };
}
