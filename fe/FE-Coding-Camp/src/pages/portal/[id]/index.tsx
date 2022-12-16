import { Button, message } from "antd";
import { useRouter } from "next/router";
import React, { ReactElement, useEffect, useState } from "react";
import EvaluationService from "../../../service/evaluation.service";
import MainLayout from "../../../components/Main-Layout";
import { NextPageWithLayout } from "../../_app";
import PropertyDetail from "../../../components/PortalEvaluationPage/PropertyDetail";
import { ArrowLeftOutlined } from "@ant-design/icons";

let flagInterval: NodeJS.Timeout;

const DetailNftPage: NextPageWithLayout = () => {
  const [assetInfo, setAssetInfo] = useState<any>({});
  const router = useRouter();
  const id = router?.query?.id;
  useEffect(() => {
    (async () => {
      if (id) {
        const [res]: any = await EvaluationService.getDetail(id);
        if (!res?.error) {
          setAssetInfo(res);
        } else {
          message.error(res?.error?.message);
        }
      }
    })();
    return () => {
      clearInterval(flagInterval);
    };
  }, [id]);

  console.log({ assetInfo });

  return (
    <>
      <Button
        type="ghost"
        shape="circle"
        size="large"
        icon={<ArrowLeftOutlined />}
        style={{ marginBottom: 20 }}
        onClick={() => router.back()}
      />
      <PropertyDetail assetInfo={assetInfo} type={assetInfo.status} />
    </>
  );
};

export default DetailNftPage;

DetailNftPage.getLayout = (page: ReactElement) => {
  return <MainLayout>{page}</MainLayout>;
};
