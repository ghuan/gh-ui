import Footer from '@/components/Footer';
import { login } from '@/services/ant-design-pro/api';
import { getFakeCaptcha } from '@/services/ant-design-pro/login';
import {
  LockOutlined,
  MobileOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  LoginForm,
  ProFormCaptcha,
  ProFormText,
} from '@ant-design/pro-components';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import { FormattedMessage, history, SelectLang, useIntl, useModel, Helmet } from '@umijs/max';
import { Alert, message, Tabs } from 'antd';
import React, { useState } from 'react';


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

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => {
  return (
    <Alert
      style={{
        marginBottom: 24,
      }}
      message={content}
      type="error"
      showIcon
    />
  );
};

const Login: React.FC = () => {
  const [userLoginState, setUserLoginState] = useState<API.LoginResult>({});
  const [type, setType] = useState<string>(localStorage.getItem('form_login_type') === 'phone' ? 'mobile' : 'account');
  const intl = useIntl();

  const getURLParamValue = (paramName:string) => {
    let url = window.location.href;
    url = decodeURI(url);
    var paramValue = "", isFound = !1;
    if(url.indexOf("?") >= 0){
      url = "?"+url.split('?')[1];
      
      if (url.indexOf("?") == 0 && url.indexOf("=") > 1) {
        var arrSource = unescape(url).substring(1, url.length).split("&"), i = 0;
        while (i < arrSource.length && !isFound) arrSource[i].indexOf("=") > 0 && arrSource[i].split("=")[0].toLowerCase() == paramName.toLowerCase() && (paramValue = arrSource[i].split("=")[1], isFound = !0), i++
      }
    }
      return paramValue;
  }
  const error = getURLParamValue('error');
  if(error){
    message.error(error);
  }
  const containerClassName = useEmotionCss(() => {
    return {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage:
        "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
      backgroundSize: '100% 100%',
    };
  });


  const handleSubmit = async (values: API.LoginParams) => {
    // 登录
    let grant_type = type === 'mobile' ? 'phone' : 'password';
    localStorage.setItem("form_login_type", grant_type);
    if(grant_type === 'phone'){
      localStorage.setItem("form_login_phone", values.mobile);
      document.getElementById('form_phone').value = values.mobile;
      document.getElementById('smsFormSubmit')?.click();
    }else {
      document.getElementById('form_username').value = values.username;
      document.getElementById('form_password').value = values.password;
      localStorage.setItem("form_login_username", values.username);
      localStorage.setItem("form_login_password", values.password);
      document.getElementById('passwordFormSubmit')?.click();
    }
  };
  const { status, type: loginType } = userLoginState;

  return (
    <div className={containerClassName}>
      <Helmet>
        <title>
          GH统一登陆平台
        </title>
      </Helmet>
      <Lang />
      <div
        style={{
          flex: '1',
          padding: '32px 0',
        }}
      >
        <LoginForm
          contentStyle={{
            minWidth: 280,
            maxWidth: '75vw',
          }}
          logo={<img alt="logo" src="/logo.svg" />}
          title="GH统一认证系统"
          subTitle={intl.formatMessage({ id: 'pages.layouts.userLayout.title' })}
          
          onFinish={async (values) => {
            await handleSubmit(values as API.LoginParams);
          }}
        >
          <Tabs
            activeKey={type}
            onChange={setType}
            centered
            items={[
              {
                key: 'account',
                label: intl.formatMessage({
                  id: 'pages.login.accountLogin.tab',
                  defaultMessage: '账户密码登录',
                }),
              },
              {
                key: 'mobile',
                label: intl.formatMessage({
                  id: 'pages.login.phoneLogin.tab',
                  defaultMessage: '手机号登录',
                }),
              },
            ]}
          />

          {status === 'error' && loginType === 'account' && (
            <LoginMessage
              content={intl.formatMessage({
                id: 'pages.login.accountLogin.errorMessage',
                defaultMessage: '账户或密码错误',
              })}
            />
          )}
          <ProFormText
                name="client_id"
                hidden={true}
               initialValue={'gh'}
              />
          {type === 'account' && (
            <>
              <ProFormText
                name="username"
                initialValue={(localStorage.getItem('form_login_type') === 'password' && localStorage.getItem("form_login_username")) || ''}
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined />,
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.username.placeholder',
                  defaultMessage: '用户名',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.username.required"
                        defaultMessage="请输入用户名!"
                      />
                    ),
                  },
                ]}
              />
              <ProFormText.Password
                name="password"
                initialValue={(localStorage.getItem('form_login_type') === 'password' && localStorage.getItem("form_login_password")) || ''}
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined />,
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.password.placeholder',
                  defaultMessage: '密码',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.password.required"
                        defaultMessage="请输入密码！"
                      />
                    ),
                  },
                ]}
              />
            </>
          )}

          {status === 'error' && loginType === 'mobile' && <LoginMessage content="验证码错误" />}
          {type === 'mobile' && (
            <>
              <ProFormText
                fieldProps={{
                  size: 'large',
                  prefix: <MobileOutlined />,
                }}
                initialValue={(localStorage.getItem('form_login_type') === 'phone' && localStorage.getItem("form_login_phone")) || ''}
                name="mobile"
                placeholder={intl.formatMessage({
                  id: 'pages.login.phoneNumber.placeholder',
                  defaultMessage: '手机号',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.phoneNumber.required"
                        defaultMessage="请输入手机号！"
                      />
                    ),
                  },
                  {
                    pattern: /^1\d{10}$/,
                    message: (
                      <FormattedMessage
                        id="pages.login.phoneNumber.invalid"
                        defaultMessage="手机号格式错误！"
                      />
                    ),
                  },
                ]}
              />
              <ProFormCaptcha
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined />,
                }}
                captchaProps={{
                  size: 'large',
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.captcha.placeholder',
                  defaultMessage: '请输入验证码',
                })}
                captchaTextRender={(timing, count) => {
                  if (timing) {
                    return `${count} ${intl.formatMessage({
                      id: 'pages.getCaptchaSecondText',
                      defaultMessage: '获取验证码',
                    })}`;
                  }
                  return intl.formatMessage({
                    id: 'pages.login.phoneLogin.getVerificationCode',
                    defaultMessage: '获取验证码',
                  });
                }}
                name="captcha"
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.captcha.required"
                        defaultMessage="请输入验证码！"
                      />
                    ),
                  },
                ]}
                onGetCaptcha={async (phone) => {
                  const result = await getFakeCaptcha({
                    phone,
                  });
                  if (!result) {
                    return;
                  }
                  message.success('获取验证码成功！验证码为：1234');
                }}
              />
            </>
          )}
          
        </LoginForm>
      </div>
      <form  hidden={true} action="/token/form" method="post">
        <input readOnly type="text" name="client_id" value="gh"/>
        <input readOnly type="text" name="grant_type" value="password"/>
        <input readOnly type="text" id="form_username" name="username"/>
        <input readOnly type="password" id="form_password" name="password"/>
        <button id={'passwordFormSubmit'} type="submit"></button>
      </form>
      <form  hidden={true} action="/token/form" method="post">
        <input readOnly type="text" name="client_id" value="gh"/>
        <input readOnly type="text" name="grant_type" value="sms"/>
        <input readOnly type="text" id="form_phone" name="phone"/>
        <button id={'smsFormSubmit'} type="submit"></button>
      </form>
      <Footer />
    </div>
  );
};

export default Login;
