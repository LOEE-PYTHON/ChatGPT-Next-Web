import { useState, useRef, useEffect, useLayoutEffect } from "react";

import RenameIcon from "../icons/rename.svg";
import ExportIcon from "../icons/share.svg";
import ReturnIcon from "../icons/return.svg";
import MaxIcon from "../icons/max.svg";
import MinIcon from "../icons/min.svg";

// loee
import * as sdapi from "../api/sdapi";

import { ChatMessage, useChatStore, useAppConfig } from "../store";

import { selectOrCopy, useMobileScreen } from "../utils";

import Locale from "../locales";

import { IconButton } from "./button";
import styles from "./home.module.scss";
// loee
import imgStyle from "./img.module.scss";

import { useNavigate } from "react-router-dom";
import { Path } from "../constant";
import { ExportMessageModal } from "./exporter";

// loee
import UploadImg from "./img-componets/upload-img";

import React from "react";
import { Tabs, Input } from "antd";

import type { RadioChangeEvent } from "antd";
import { Radio } from "antd";

import { Button } from "antd";

import { Col, Row } from "antd";

import { Image } from "antd";
import { Alert } from "antd";

const onRightClick = (e: any, message: ChatMessage) => {
  // copy to clipboard
  if (selectOrCopy(e.currentTarget, message.content)) {
    e.preventDefault();
  }
};

const { TabPane } = Tabs;
const { TextArea } = Input;
const onChangeByText2ImgInput = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
) => {
  console.log(e.target.value);
};

const Text2ImgInput: React.FC = () => (
  <>
    <TextArea
      placeholder="请输入Prompt提示词（建议输入英文）"
      allowClear
      onChange={onChangeByText2ImgInput}
      rows={4}
      className={`${imgStyle["textArea"]} ${imgStyle["textArea-black"]}`} // 应用样式类
    />
  </>
);

const RadioModel: React.FC = () => {
  const [RadioModelValue, setRadioModelValue] = useState(1);

  const onChange = (e: RadioChangeEvent) => {
    console.log("radio checked", e.target.value);
    setRadioModelValue(e.target.value);
  };

  return (
    <Radio.Group onChange={onChange} value={RadioModelValue}>
      <Radio className={imgStyle.radioButton} value={1}>
        通用
      </Radio>
      <Radio className={imgStyle.radioButton} value={2}>
        美女
      </Radio>
      <Radio className={imgStyle.radioButton} value={3}>
        国风美女
      </Radio>
      <Radio className={imgStyle.radioButton} value={4}>
        漫画
      </Radio>
    </Radio.Group>
  );
};
const RadioResolution: React.FC = () => {
  const [RadioResolutionValue, setRadioResolutionValue] = useState(1);

  const onChange = (e: RadioChangeEvent) => {
    console.log("radio checked", e.target.value);
    setRadioResolutionValue(e.target.value);
  };

  return (
    <Radio.Group onChange={onChange} value={RadioResolutionValue}>
      <Radio className={imgStyle.radioButton} value={1}>
        512*512
      </Radio>
      <Radio className={imgStyle.radioButton} value={2}>
        384*768
      </Radio>
      <Radio className={imgStyle.radioButton} value={3}>
        512*768
      </Radio>
    </Radio.Group>
  );
};

const RadioCartoon: React.FC = () => {
  const [RadioCartoon, setRadioCartoonValue] = useState(1);

  const onChange = (e: RadioChangeEvent) => {
    console.log("radio checked", e.target.value);
    setRadioCartoonValue(e.target.value);
  };

  return (
    <Radio.Group onChange={onChange} value={RadioCartoon}>
      <Radio className={imgStyle.themeAuto} value={1}>
        {Locale.Drawing.img2img}
      </Radio>
    </Radio.Group>
  );
};

export { RadioModel, RadioResolution, RadioCartoon };

const Btns: React.FC = () => (
  <Row gutter={16}>
    <Col span={12}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Button
          type="primary"
          ghost
          style={{ width: "80%" }}
          className={imgStyle.btns}
        >
          {Locale.Drawing.translate}
        </Button>
      </div>
    </Col>
    <Col span={12}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Button
          type="primary"
          style={{ width: "80%" }}
          className={imgStyle.btns}
        >
          {Locale.Drawing.generate}
        </Button>
      </div>
    </Col>
  </Row>
);

export { Btns };

type CardContainerProps = {
  children: React.ReactNode;
};

interface PaddedComponentProps {
  children: React.ReactNode;
}

const PaddedComponent: React.FC<PaddedComponentProps> = ({ children }) => (
  <div style={{ padding: "5px 0" }}>{children}</div>
);

const items = [
  {
    key: "1",
    label: "文字生成图片",
    children: (
      <>
        <PaddedComponent>
          <Text2ImgInput />
        </PaddedComponent>

        <PaddedComponent>
          <RadioModel />
        </PaddedComponent>

        <PaddedComponent>
          <RadioResolution />
        </PaddedComponent>

        <PaddedComponent>
          <Btns />
        </PaddedComponent>
        <PaddedComponent>
          <Alert
            className={imgStyle.alertCard}
            message={
              <>
                <b
                  className={imgStyle.alertCardTitle}
                  style={{ fontSize: "1.3em" }}
                >
                  修饰词参考
                </b>
              </>
            }
            description={
              <>
                <p>
                  a dog wearing a hat
                  <Button
                    type="link"
                    onClick={(e) =>
                      onRightClick(e, {
                        content: "a dog wearing a hat",
                        role: "user",
                        date: "",
                      })
                    }
                  >
                    复制
                  </Button>
                  <br />
                  戴帽子的狗
                </p>
                <p>
                  Best quality, masterpiece, ultra high res, raw photo, 1 girl,
                  cold light
                  <Button
                    type="link"
                    onClick={(e) =>
                      onRightClick(e, {
                        content:
                          "Best quality, masterpiece, ultra high res, raw photo, 1 girl, cold light",
                        role: "user",
                        date: "",
                      })
                    }
                  >
                    复制
                  </Button>
                  <br />
                  最佳质量，杰作，超高分辨率，原始照片，1个女孩，冷光
                </p>
              </>
            }
            type="info"
          />
        </PaddedComponent>
      </>
    ),
  },
  {
    key: "2",
    label: `图片转漫画`,
    children: (
      <>
        <UploadImg></UploadImg>
        <RadioCartoon></RadioCartoon>
      </>
    ),
  },
];

const onChangeByTab = (key: any) => {
  console.log(`Tab changed to: ${key}`);
};

// loee
const Tab: React.FC = () => (
  <Tabs
    defaultActiveKey="1"
    onChange={onChangeByTab}
    centered
    className={imgStyle["ant-tabs-tab"]}
  >
    {items.map((item) => (
      <TabPane
        tab={item.label}
        key={item.key}
        className={imgStyle["ant-tabs-tab-active"]}
      >
        {item.children}
      </TabPane>
    ))}
  </Tabs>
);

const SelectedAtlas: React.FC = () => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Image
        preview={{ visible: false }}
        width={200}
        src="https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp"
        onClick={() => setVisible(true)}
      />
      <Image
        preview={{ visible: false }}
        width={200}
        src="https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp"
        onClick={() => setVisible(true)}
      />
      <Image
        preview={{ visible: false }}
        width={200}
        src="https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp"
        onClick={() => setVisible(true)}
      />
      <div style={{ display: "none" }}>
        <Image.PreviewGroup
          preview={{ visible, onVisibleChange: (vis) => setVisible(vis) }}
        >
          <Image src="https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp" />
          <Image src="https://gw.alipayobjects.com/zos/antfincdn/cV16ZqzMjW/photo-1473091540282-9b846e7965e3.webp" />
          <Image src="https://gw.alipayobjects.com/zos/antfincdn/x43I27A55%26/photo-1438109491414-7198515b166b.webp" />
        </Image.PreviewGroup>
      </div>
    </>
  );
};

const SelectedPhotos: React.FC = () => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Image
        preview={{ visible: false }}
        width={200}
        src="https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp"
        onClick={() => setVisible(true)}
      />
      <Image
        preview={{ visible: false }}
        width={200}
        src="https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp"
        onClick={() => setVisible(true)}
      />
      <Image
        preview={{ visible: false }}
        width={200}
        src="https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp"
        onClick={() => setVisible(true)}
      />
      <div style={{ display: "none" }}>
        <Image.PreviewGroup
          preview={{ visible, onVisibleChange: (vis) => setVisible(vis) }}
        >
          <Image src="https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp" />
          <Image src="https://gw.alipayobjects.com/zos/antfincdn/cV16ZqzMjW/photo-1473091540282-9b846e7965e3.webp" />
          <Image src="https://gw.alipayobjects.com/zos/antfincdn/x43I27A55%26/photo-1438109491414-7198515b166b.webp" />
        </Image.PreviewGroup>
      </div>
    </>
  );
};

const MyPhotos: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [random, setRandom] = useState<number>();

  return (
    <>
      <Image
        width={200}
        src={`https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png?${random}`}
        placeholder={
          <Image
            preview={false}
            src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png?x-oss-process=image/blur,r_50,s_50/quality,q_1/resize,m_mfit,h_200,w_200"
            width={200}
          />
        }
      />
      <Image
        width={200}
        src={`https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png?${random}`}
        placeholder={
          <Image
            preview={false}
            src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png?x-oss-process=image/blur,r_50,s_50/quality,q_1/resize,m_mfit,h_200,w_200"
            width={200}
          />
        }
      />
      <Image
        width={200}
        src={`https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png?${random}`}
        placeholder={
          <Image
            preview={false}
            src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png?x-oss-process=image/blur,r_50,s_50/quality,q_1/resize,m_mfit,h_200,w_200"
            width={200}
          />
        }
      />
      <div style={{ display: "none" }}>
        <Image.PreviewGroup
          preview={{ visible, onVisibleChange: (vis) => setVisible(vis) }}
        >
          <Image src="https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp" />
          <Image src="https://gw.alipayobjects.com/zos/antfincdn/cV16ZqzMjW/photo-1473091540282-9b846e7965e3.webp" />
          <Image src="https://gw.alipayobjects.com/zos/antfincdn/x43I27A55%26/photo-1438109491414-7198515b166b.webp" />
        </Image.PreviewGroup>
      </div>
    </>
  );
};
export { SelectedAtlas, SelectedPhotos, MyPhotos };

interface MarginBottomWrapperProps {
  children: React.ReactNode;
}
const MarginBottomWrapper: React.FC<MarginBottomWrapperProps> = ({
  children,
}) => {
  return <div style={{ marginBottom: "40px" }}>{children}</div>;
};

const operations = <Button type="ghost">刷新作品</Button>;

const TabImgsitems = [
  {
    key: "1",
    label: `精选图集`,
    children: (
      <>
        <MarginBottomWrapper>
          <SelectedAtlas />
        </MarginBottomWrapper>
      </>
    ),
  },
  {
    key: "2",
    label: `精选作品`,
    children: (
      <>
        <MarginBottomWrapper>
          <SelectedPhotos />
        </MarginBottomWrapper>
      </>
    ),
  },
  {
    key: "3",
    label: `我的作品`,
    children: (
      <>
        <MarginBottomWrapper>
          <MyPhotos />
        </MarginBottomWrapper>
      </>
    ),
  },
];

const onChangeByTabImgs = (key: any) => {
  console.log(`Tab changed to: ${key}`);
};

const TabImgs: React.FC = () => (
  <Tabs
    defaultActiveKey="1"
    onChange={onChangeByTabImgs}
    centered
    tabBarExtraContent={operations}
    className={imgStyle["ant-tabs-tab"]}
  >
    {TabImgsitems.map((item) => (
      <TabPane
        tab={item.label}
        key={item.key}
        className={imgStyle["ant-tabs-tab-active"]}
      >
        {item.children}
      </TabPane>
    ))}
  </Tabs>
);

export { Tab, TabImgs, Text2ImgInput };

const CardContainer: React.FC<CardContainerProps> = ({ children }) => {
  return <div style={{ width: "100%", height: "100%" }}>{children}</div>;
};

export { CardContainer };

export function Chat() {
  const chatStore = useChatStore();
  const [session, sessionIndex] = useChatStore((state) => [
    state.currentSession(),
    state.currentSessionIndex,
  ]);
  const config = useAppConfig();

  const [showExport, setShowExport] = useState(false);

  const isMobileScreen = useMobileScreen();
  const navigate = useNavigate();

  const renameSession = () => {
    const newTopic = prompt(Locale.Chat.Rename, session.topic);
    if (newTopic && newTopic !== session.topic) {
      chatStore.updateCurrentSession((session) => (session.topic = newTopic!));
    }
  };

  return (
    <div className={styles.chat} key={session.id}>
      <div className="window-header">
        <div className="window-header-title">
          <div
            className={`window-header-main-title " ${styles["chat-body-title"]}`}
            // onClickCapture={renameSession}
          >
            {/* {!session.topic ? DEFAULT_TOPIC : session.topic} */}
            图片生成
          </div>
          <div className="window-header-sub-title">图片生成</div>
        </div>
        <div className="window-actions">
          <div className={"window-action-button" + " " + styles.mobile}>
            <IconButton
              icon={<ReturnIcon />}
              bordered
              title={Locale.Chat.Actions.ChatList}
              onClick={() => navigate(Path.Home)}
            />
          </div>
          <div className="window-action-button">
            <IconButton
              icon={<RenameIcon />}
              bordered
              onClick={renameSession}
            />
          </div>
          <div className="window-action-button">
            <IconButton
              icon={<ExportIcon />}
              bordered
              title={Locale.Chat.Actions.Export}
              onClick={() => {
                setShowExport(true);
              }}
            />
          </div>
          {!isMobileScreen && (
            <div className="window-action-button">
              <IconButton
                icon={config.tightBorder ? <MinIcon /> : <MaxIcon />}
                bordered
                onClick={() => {
                  config.update(
                    (config) => (config.tightBorder = !config.tightBorder),
                  );
                }}
              />
            </div>
          )}
        </div>
      </div>
      <div className="window-card">
        <CardContainer>
          <Tab></Tab>
          <TabImgs></TabImgs>
        </CardContainer>
      </div>
      {showExport && (
        <ExportMessageModal onClose={() => setShowExport(false)} />
      )}
    </div>
  );
}
