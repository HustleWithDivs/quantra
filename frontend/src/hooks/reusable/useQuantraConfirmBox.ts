import { useState, useCallback } from 'react';

interface UseQuantraConfirmBoxOptions {
  onExecuteApiCall: () => Promise<void> | void;
}

export function useQuantraConfirmBox({ onExecuteApiCall }: UseQuantraConfirmBoxOptions) {
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleOpenConfirm = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleCloseConfirm = useCallback(() => {
    setIsOpen(false);
    setIsProcessing(false);
  }, []);

  const handleExecuteAction = useCallback(async () => {
    try {
      setIsProcessing(true);
      // Execute the injected asynchronous API operation handler
      await onExecuteApiCall();
      // Safe closure after processing completes successfully
      setIsOpen(false);
    } catch (error) {
      console.error('Action transaction failure sequence detected:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [onExecuteApiCall]);

  return {
    isOpen,
    isProcessing,
    handleOpenConfirm,
    handleCloseConfirm,
    handleExecuteAction,
  };
}
