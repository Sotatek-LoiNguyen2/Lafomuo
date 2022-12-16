import React, { useState, useEffect } from "react";
import { message } from "antd"
import EvaluationService from "../../../service/evaluation.service";
import {Router, useRouter} from "next/router";

const useAsset = () => {
    const router = useRouter()
    const [isShowDeleteModal, setIsShowDeleteModal] = useState(false);
    const [isCanceling, setIsCanceling] = useState(false);
	
    const deleteAsset = async (id: any) => {
        setIsCanceling(true)
        const [res, err]: any = await EvaluationService.deleteAsset(id);
        setIsCanceling(false)
        if(err) {
            return message.error(err)
        }
        message.success("Asset deleted successfully")
        setIsShowDeleteModal(false)
        router.back()
    }

	return {
        isShowDeleteModal,
        setIsShowDeleteModal,
		isCanceling,
        deleteAsset
	};
};

export { useAsset };
