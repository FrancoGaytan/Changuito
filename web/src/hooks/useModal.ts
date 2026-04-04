import { useState, useCallback } from 'react';

interface ConfirmOptions {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
}

interface ModalState extends ConfirmOptions {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const defaultState: ModalState = {
  open: false,
  title: '',
  message: '',
  onConfirm: () => {},
  onCancel: () => {},
};

export function useModal() {
  const [state, setState] = useState<ModalState>(defaultState);

  const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setState({
        ...options,
        open: true,
        onConfirm: () => {
          setState(defaultState);
          resolve(true);
        },
        onCancel: () => {
          setState(defaultState);
          resolve(false);
        },
      });
    });
  }, []);

  return { modalState: state, confirm };
}
