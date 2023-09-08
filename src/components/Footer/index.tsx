import { GithubOutlined,MailOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import React from 'react';

const Footer: React.FC = () => {
  const intl = useIntl();
  const defaultMessage = intl.formatMessage({
    id: 'app.copyright.produced',
    defaultMessage: '蚂蚁集团体验技术部出品',
  });

  const currentYear = new Date().getFullYear();

  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      copyright={`${currentYear} ${defaultMessage}`}
      links={[
        {
          key: 'Gh Framework',
          title: 'Gh Framework',
          href: 'https://github.com/ghuan',
          blankTarget: true,
        },
        {
          key: 'github',
          title: <GithubOutlined />,
          href: 'https://github.com/ghuan',
          blankTarget: true,
        },
        {
          key: 'email',
          title: <MailOutlined />,
          href: '2223486623@qq.com',
          blankTarget: true,
        },
      ]}
    />
  );
};

export default Footer;
