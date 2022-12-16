import React from "react";
import Link from "next/link"
import {ArrowLeftOutlined} from "@ant-design/icons";

const NotFoundPage:React.FC = () => {
    return (
        <div className="fof">
            <h1>Error 404</h1>
            <Link href="/">
                <ArrowLeftOutlined/> Back to home page
            </Link>
        </div>
    )
}

export default NotFoundPage
