import Footer from '@/components/Footer';
import { Layout, Button } from 'antd';
import { login } from '@/services/ant-design-pro/api';
import { getFakeCaptcha } from '@/services/ant-design-pro/login';
import {
  DeploymentUnitOutlined,
  LockOutlined,
  MobileOutlined,
  TaobaoCircleOutlined,
  UserOutlined,
  WeiboCircleOutlined,
} from '@ant-design/icons';
import {
  PageContainer,
  ProCard,
  ProFormCheckbox,
  CheckCard,
} from '@ant-design/pro-components';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import { FormattedMessage, history, SelectLang, useIntl, useModel, Helmet } from '@umijs/max';
import { Alert, message, Tabs } from 'antd';
import React, { useState } from 'react';
import { flushSync } from 'react-dom';
const { Header, Content } = Layout;
const headerStyle: React.CSSProperties = {
  color: '#777',
  fontSize:16,
  paddingInline: 10,
  height: 64,
  backgroundColor: '#f8f8f8',
};
const contentStyle: React.CSSProperties = {
  backgroundColor: '#fff',
};

const Lang = () => {
  const langClassName = useEmotionCss(({ token }) => {
    return {
      width: 42,
      height: 42,
      lineHeight: '42px',
      position: 'fixed',
      right: 16,
      borderRadius: token.borderRadius,
      ':hover': {
        backgroundColor: token.colorBgTextHover,
      },
    };
  });

  return (
    <div className={langClassName} data-lang>
      {SelectLang && <SelectLang />}
    </div>
  );
};

const Confirm: React.FC = () => {

  return (
    <Layout>
    <Lang />
    <Header style={headerStyle}>
      <DeploymentUnitOutlined />
      <span>&nbsp;开放平台</span>
      <a className={'ant-pro-global-footer-list-link'} href={'https://github.com/ghuan'} style={{float:'right',marginRight:55,fontSize:12}}>技术支持</a>
    </Header>
    <Content style={contentStyle}>
      <ProCard
      bordered
      layout="center">
        将获得以下权限：
       
      </ProCard>
      <ProCard
      bordered
      layout="center">
         <CheckCard.Group
        defaultValue="A"
      >
        <CheckCard title="server" value="A" />
        
      </CheckCard.Group>
       
      </ProCard>
       <ProCard
      bordered
      layout="center">
        授权后表明你已同意&emsp;<a className={'ant-pro-global-footer-list-link'} href={'https://github.com/ghuan'} style={{float:'right',fontSize:12}}>服务协议</a>
               &emsp;<Button type="primary">授权</Button>
      </ProCard>
    </Content>
    <Footer></Footer>
  </Layout>
  );
};

export default Confirm;
