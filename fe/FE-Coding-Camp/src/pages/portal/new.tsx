import React, { ReactElement, useState, useEffect } from "react";
import {
  Typography,
  Button,
  Divider,
  Form,
  Input,
  Upload,
  message,
  Row,
  Col,
  Image as CutomImg,
  Modal,
} from "antd";

const { Title } = Typography;
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload/interface";
import type { UploadChangeParam } from "antd/es/upload";
import {
  CloseOutlined,
  LoadingOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { toBase64 } from "../../utils/utility";
import EvaluationService, {
  IBodyEvaluation,
} from "../../service/evaluation.service";
import { useRouter } from "next/router";
import { NextPageWithLayout } from "../_app";
import MainLayout from "../../components/Main-Layout";
import PortalPage from "./index";
import ObjectID from "bson-objectid";
import PreviewModal, {
  getBase64Preview,
} from "../../components/common/modals/PreviewModal";
import { getUrl } from "../../utils/utility";

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const beforeUpload = (file: RcFile) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
};

const NewLandPage: NextPageWithLayout = (props) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingFile, setLoadingFile] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();
  const [projectImgList, setProjectImgList] = useState<UploadFile[]>([]);
  const [certificates, setCertificates] = useState<UploadFile[]>([]);
  const [form] = Form.useForm();
  const router = useRouter();
  const [attr, setAttr] = useState<any>([
    {
      id: ObjectID(24).toHexString(),
      key: "",
      value: "",
    },
  ]);
  const assetId = router?.query?.id || "";

  useEffect(() => {
    if (!!assetId) {
      fetchAssetDetails();
    }
  }, [assetId]);

  const fetchAssetDetails = async () => {
    try {
      setLoading(true);
      const [res]: any = await EvaluationService.getDetail(assetId);
      if (!res?.error) {
        console.log({ res });
        form.setFieldsValue(res);
        setImageUrl(getUrl(res.avatar));
        fetchAttribute(res?.attributes);
        fetchProjectImgList(res?.projectImages);
        fetchLegalPapersList(res?.certificates);
      } else {
        message.error(res?.error?.message);
      }
      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      message.error("Something error");
    }
  };

  const fetchAttribute = (arr: any[]) => {
    let newAttr: any[] = [];
    arr.forEach((item, index) => {
      const id = ObjectID(24).toHexString();
      newAttr.push({ ...item, id });
      form.setFieldsValue({
        [`key[${id}]`]: item.key,
        [`value[${id}]`]: item.value,
      });
    });
    setAttr([...newAttr]);
  };

  const fetchProjectImgList = (arr: any[]) => {
    const newImageList: any[] = [];
    arr.forEach((item, index) => {
      newImageList.push({
        ...item,
        tempURL: item.url,
        url: getUrl(item),
      });
    });
    setProjectImgList([...newImageList]);
  };

  const fetchLegalPapersList = (arr: any[]) => {
    const newImageList: any[] = [];
    arr.forEach((item, index) => {
      newImageList.push({
        ...item,
        tempURL: item.url,
        url: getUrl(item),
      });
    });
    setCertificates([...newImageList]);
  };

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64Preview(file.originFileObj as RcFile);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url!.substring(file.url!.lastIndexOf("/") + 1)
    );
  };

  const addAttr = () => {
    setAttr([...attr, { id: ObjectID(24).toHexString(), key: "", value: "" }]);
  };

  const onRemoveAttr = (id: string) => {
    const _attr = attr.filter((item: any) => item.id !== id);
    setAttr(_attr);
  };

  const propPaper: UploadProps = {
    onChange({ file, fileList }) {
      if (file.status !== "uploading") {
        console.log(file, fileList);
      }
    },
    beforeUpload: (file, fileList) => {
      const length = fileList.length;
      console.log([...certificates, fileList[length - 1]]);
      setCertificates([...certificates, file]);
      return false;
    },
    onRemove: (file) => {
      const index = certificates.indexOf(file);
      const newFileList = certificates.slice();
      newFileList.splice(index, 1);
      setCertificates(newFileList);
    },
    defaultFileList: [],
  };

  const onFinish = async (values: any) => {
    try {
      let projectImages = await Promise.all(
        projectImgList.map(async (file: any, index: number) => {
          if (file.originFileObj) {
            return {
              name: file.name,
              data: await toBase64(file.originFileObj),
            };
          }
          return {
            ...file,
            url: file.tempURL,
          };
        })
      );
      setLoading(true);
      let attributes: any = [];
      Object.entries(values).forEach(([key, val]) => {
        if (key.startsWith("key")) {
          const [, index] = key.split("key");
          attributes.push({
            key: values[`key${index}`],
            value: values[`value${index}`],
          });
        }
      });

      const formData: any = {
        nftName: values.nftName,
        email: values.email,
        phone: values.phone,
        address: values.address,
        externalUrl: values.externalUrl,
        youtubeUrl: values.youtubeUrl,
        description: values.description,
        attributes,
        // certificates: await Promise.all(
        //   certificates.map(async (file: any, index: number) => {
        //     return {
        //       name: file.name,
        //       data: await toBase64(file),
        //     };
        //   })
        // ),
        certificates: await Promise.all(
          certificates.map(async (file: any, index: number) => {
            if (file && !file.tempURL) {
              return {
                name: file.name,
                data: await toBase64(file),
              };
            }
            return {
              ...file,
              url: file.tempURL,
            };
          })
        ),
        projectImages,
      };
      if (values?.avatar?.file?.originFileObj) {
        formData.avatar = {
          name: "logo.png",
          data: await toBase64(values.avatar.file.originFileObj),
        };
      }

      let res: any;
      let messageContent = "";
      if (!!assetId) {
        const [response]: any = await EvaluationService.updateLand(
          formData,
          assetId
        );
        res = response;
        messageContent = "Update evaluation successfully";
      } else {
        const [response]: any = await EvaluationService.createLand(formData);
        res = response;
        messageContent = "Create evaluation successfully";
      }
      if (!res?.error) {
        router.back();
        message.success(messageContent);
      } else {
        message.error(res?.error?.message);
      }
      setLoading(false);
    } catch (err: any) {
      console.log({ err });
      setLoading(false);
      message.error("Something error");
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const handleChange: UploadProps["onChange"] = (
    info: UploadChangeParam<UploadFile>
  ) => {
    if (info.file.status === "uploading") {
      setLoadingFile(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj as RcFile, (url) => {
        setLoadingFile(false);
        setImageUrl(url);
      });
    }
  };

  const onChangeProjectImages: UploadProps["onChange"] = ({
    fileList: newFileList,
  }) => {
    console.log({ newFileList });
    setProjectImgList(newFileList);
  };

  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as RcFile);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  const uploadButton = (
    <div>
      {loadingFile ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <>
      <Row className="justify-center">
        <Col xxl={12} md={20} xs={24}>
          <div className="box">
            <Title level={2} style={{ textAlign: "center" }}>
              {!!assetId ? "Update LAND" : "New LAND"}
            </Title>
            <CloseOutlined
              style={{
                fontSize: 20,
                cursor: "pointer",
                position: "absolute",
                top: 30,
                right: 30,
              }}
              onClick={() => router.back()}
            />
            <br />
            <br />
            <Form
              form={form}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Divider orientation="center" orientationMargin="0">
                Basic Information
              </Divider>
              <Form.Item
                label="Avatar"
                name="avatar"
                rules={[{ required: true, message: "Please upload avatar!" }]}
              >
                <Upload
                  customRequest={({ file, onSuccess }: any) => {
                    onSuccess("ok");
                  }}
                  name="avatar"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  beforeUpload={beforeUpload}
                  onChange={handleChange}
                >
                  {imageUrl ? (
                    <CutomImg
                      src={imageUrl}
                      alt="avatar"
                      style={{ width: 104, height: 104 }}
                      preview={false}
                    />
                  ) : (
                    uploadButton
                  )}
                </Upload>
              </Form.Item>

              <Form.Item
                label="NFT Name"
                name="nftName"
                rules={[
                  { required: true, message: "This field cannot be empty." },
                ]}
              >
                <Input placeholder="Input NFT name" />
              </Form.Item>
              <Form.Item
                label="Phone"
                name="phone"
                rules={[
                  { required: true, message: "This field cannot be empty." },
                ]}
              >
                <Input placeholder="Input Phone" />
              </Form.Item>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "This field cannot be empty." },
                ]}
              >
                <Input placeholder="Input Email" />
              </Form.Item>
              <Form.Item
                label="Address"
                name="address"
                rules={[
                  { required: true, message: "This field cannot be empty." },
                ]}
              >
                <Input placeholder="Input Address" />
              </Form.Item>

              <Form.Item
                label="Project Description"
                name="description"
                rules={[
                  { required: true, message: "This field cannot be empty." },
                ]}
              >
                <Input.TextArea placeholder="Input Description" rows={6} />
              </Form.Item>

              <Form.Item
                label="external url"
                name="externalUrl"
                rules={[
                  { required: true, message: "This field cannot be empty." },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="youtube url"
                name="youtubeUrl"
                rules={[
                  { required: true, message: "This field cannot be empty." },
                ]}
              >
                <Input />
              </Form.Item>

              <Divider orientation="center" orientationMargin="0">
                Attribute
              </Divider>

              {attr.map((item: any) => (
                <Row key={item.id} gutter={15}>
                  <Col span={11}>
                    <Form.Item
                      label=""
                      name={`key[${item.id}]`}
                      rules={[
                        {
                          required: true,
                          message: "This field cannot be empty.",
                        },
                      ]}
                    >
                      <Input prefix={<span>Key: </span>} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label=""
                      name={`value[${item.id}]`}
                      rules={[
                        {
                          required: true,
                          message: "This field cannot be empty.",
                        },
                      ]}
                    >
                      <Input prefix={<span>value: </span>} />
                    </Form.Item>
                  </Col>
                  <Col span={1}>
                    <CloseOutlined
                      style={{ marginTop: 10, cursor: "pointer" }}
                      onClick={() => onRemoveAttr(item.id)}
                    />
                  </Col>
                </Row>
              ))}
              <div>
                <Button onClick={addAttr} type="primary">
                  {" "}
                  <PlusOutlined /> Add new
                </Button>
              </div>

              <Divider orientation="center" orientationMargin="0">
                Project Images
              </Divider>

              <Form.Item
                label="Images"
                name="projectImages"
                rules={[
                  { required: true, message: "This field cannot be empty." },
                ]}
              >
                <Upload
                  listType="picture-card"
                  fileList={projectImgList}
                  onChange={onChangeProjectImages}
                  onPreview={handlePreview}
                >
                  {projectImgList.length < 5 && "+ Upload"}
                </Upload>
              </Form.Item>

              <Divider orientation="center" orientationMargin="0">
                Legal Papers
              </Divider>

              <Form.Item
                label="Docs"
                name="certificates"
                rules={[
                  { required: true, message: "This field cannot be empty." },
                ]}
              >
                <Upload
                  customRequest={({ file, onSuccess }: any) => {
                    onSuccess("ok");
                  }}
                  fileList={certificates}
                  {...propPaper}
                >
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
              </Form.Item>

              <Divider orientation="center" orientationMargin="0"></Divider>

              <div className="flex justify-center">
                <Button loading={loading} type="primary" htmlType="submit">
                  Submit Land
                </Button>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
      <PreviewModal
        previewOpen={previewOpen}
        setPreviewOpen={setPreviewOpen}
        previewImage={previewImage}
        previewTitle={previewTitle}
      />
    </>
  );
};

export default NewLandPage;

NewLandPage.getLayout = (page: ReactElement) => {
  return <MainLayout>{page}</MainLayout>;
};
