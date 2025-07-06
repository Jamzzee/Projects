'use client';
import { ConfirmModalWindowProps } from '@/types/ConfirmModalWindowType';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import Button from './Buttons';

const Overlay = styled.section`
  position: fixed;
  inset: 0;
  background-color: var(--backdrop-color);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
`;

const Modal = styled.div`
  text-align: center;
  background-color: var(--color-grey-0);
  padding: 1.5rem 3rem;
  border-radius: var(--border-radius-md);
  max-width: 40rem;
  box-shadow: var(--shadow-lg);
`;

const ModalMessage = styled.p`
  font-size: 1.6rem;
  margin-bottom: 2rem;
`;

const ModalButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.2rem;
`;

export default function ConfirmModalWindow({
  message,
  onConfirm,
  onCancel,
}: ConfirmModalWindowProps) {
  const portalId = 'modal-window';
  let portalModal = document.getElementById(portalId);
  if (!portalModal) {
    portalModal = document.createElement('div');
    portalModal.setAttribute('id', portalId);
    document.body.appendChild(portalModal);
  }

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
      if (e.key === 'Enter') onConfirm();
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onCancel, onConfirm]);

  const modalContent = (
    <Overlay onClick={onCancel} role="dialog" aria-modal="true">
      <Modal onClick={e => e.stopPropagation()}>
        <ModalMessage id="modal-message">{message}</ModalMessage>
        <ModalButtons>
          <Button variant="cancel" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="neutral" onClick={onConfirm}>
            Confirm
          </Button>
        </ModalButtons>
      </Modal>
    </Overlay>
  );

  return createPortal(modalContent, portalModal);
}
