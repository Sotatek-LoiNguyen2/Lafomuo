import React, { useState } from "react";
import { Image as CutomImg, Modal } from "antd";
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload/interface";

interface IProps {
  previewOpen: boolean;
  setPreviewOpen: (show: boolean) => void;
  previewTitle: string;
  previewImage: string;
}
export const getBase64Preview = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const PreviewModal: React.FC<IProps> = ({
  previewOpen,
  setPreviewOpen,
  previewTitle,
  previewImage,
}) => {
  const handleCancel = () => setPreviewOpen(false);
  return (
    <Modal
      open={previewOpen}
      title={previewTitle}
      footer={null}
      onCancel={handleCancel}
    >
      <img alt="example" style={{ width: "100%" }} src={previewImage} />
    </Modal>
  );
};

export default PreviewModal;
