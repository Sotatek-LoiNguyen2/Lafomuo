import React, { useState } from "react";
import { Modal, Form, Button } from "antd";
import style from "./style.module.scss";
import Image from "next/image";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
const antIcon = <LoadingOutlined style={{ fontSize: 15 }} spin />;
interface IProps {
	isShown: boolean;
	onCancel: (show: boolean) => void;
	onConfirmCancel: () => void;
	isCanceling: boolean;
}

const ListingCancelModal: React.FC<IProps> = ({
	isShown,
	isCanceling,
	onCancel,
	onConfirmCancel,
}) => {

	const handleOk = () => {};

	const handleCancel = () => {
		onCancel(false);
	};

	return (
		<>
			<Modal
				className={"modal-custom modal-responsive"}
				footer={null}
				visible={isShown}
				onOk={handleOk}
				closable={false}
				onCancel={handleCancel}
				maskClosable={!isCanceling}
			>
				<Form className={style.listingCancelModal}>
					<div className={style.logo}>
						<Image
							src="/icons/danger-circle.svg"
							alt="danger"
							width={83}
							height={83}
						/>
					</div>
                    <div className={`${style.title} title`} style={{marginBottom: 30}}>
                        Are you sure you want to delete your asset?
                    </div>

					<div className="btn__container btn-yes-no">
						<Button
							className={`btn--yes convert-eth`}
							onClick={onConfirmCancel}
							disabled={isCanceling}
						>
							{isCanceling && (
								<Spin
									indicator={antIcon}
									className={style.spin}
									style={{ marginRight: 10 }}
								/>
							)}
							Yes
						</Button>
						<Button
							type={"primary"}
                            className="btn--delete"
							onClick={() => onCancel(false)}
							disabled={isCanceling}
						>
							No
						</Button>
					</div>
				</Form>
			</Modal>
		</>
	);
};

export default ListingCancelModal;
