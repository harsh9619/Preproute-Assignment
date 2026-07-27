import React from 'react';
import { Modal } from 'antd';
import type { ModalProps } from 'antd';

export interface CommonModalProps extends ModalProps {
  children: React.ReactNode;
}

const CommonModal: React.FC<CommonModalProps> = ({
  children,
  className = '',
  destroyOnClose = true,
  maskClosable = true,
  centered = true,
  ...props
}) => {
  return (
    <Modal
      centered={centered}
      destroyOnClose={destroyOnClose}
      maskClosable={maskClosable}
      className={`custom-antd-modal ${className}`}
      {...props}
    >
      <div style={{ paddingTop: '0.5rem' }}>
        {children}
      </div>
    </Modal>
  );
};

export default CommonModal;
