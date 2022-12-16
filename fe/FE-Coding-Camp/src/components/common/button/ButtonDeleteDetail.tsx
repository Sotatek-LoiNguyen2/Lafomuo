import React, { useState } from "react";
import { Button } from "antd";
import DeleteModal from "../../common/modals/DeleteModal";
import { useAsset } from "../../../hooks/useAsset";
import Link from "next/link";
import { URL_ASSET } from "../../../constants/url"

const PassedAsset: React.FC<{ id: any }> = ({ id }) => {
  const { isCanceling, isShowDeleteModal, setIsShowDeleteModal, deleteAsset } =
    useAsset();
  return (
    <div className="btn__container">
      <Button
        className="btn--delete"
        onClick={() => {
          setIsShowDeleteModal(true);
        }}
      >
        Delete
      </Button>
      <Link href={`${URL_ASSET}?id=${id}`}>
        <Button className="btn--edit" type="primary">
          Edit
        </Button>
      </Link>
      <DeleteModal
        isShown={isShowDeleteModal}
        onCancel={setIsShowDeleteModal}
        onConfirmCancel={() => deleteAsset(id)}
        isCanceling={isCanceling}
      />
    </div>
  );
};

export default PassedAsset;
