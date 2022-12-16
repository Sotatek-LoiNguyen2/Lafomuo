import React, { ReactElement } from "react";
import MainLayout from "../components/Main-Layout";
import { useRouter } from "next/router";

const PortalPage = (props: any) => {
  const router = useRouter();
  router.push("/portfolio");
};

PortalPage.getLayout = (page: ReactElement) => {
  return <MainLayout>{page}</MainLayout>;
};

export default PortalPage;
