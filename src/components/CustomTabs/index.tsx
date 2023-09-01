
import { 
  EllipsisOutlined,
  VerticalRightOutlined,
  VerticalLeftOutlined,
  ReloadOutlined,
  CloseOutlined
 } from '@ant-design/icons';
import { Tabs,Dropdown,Button } from 'antd';
import { useIntl,useModel } from '@umijs/max';

import React from 'react';

export const getTabs = () => {
  return ({
    isKeep,
    keepElements,
    navigate,
    dropByCacheKey,
    dropLeftTabs,
    dropRightTabs,
    dropOtherTabs,
    refreshTab,
    closeTab,
    local,
    icons,
    activeKey,
    tabProps,
    tabNameMap,
  }: any) => {
    const intl = useIntl();
    const {initialState} = useModel('@@initialState');
    const items = [
      {
        label: intl.formatMessage({
          id: `tabs.close.current`,
          defaultMessage: "关闭当前",
        }),
        icon: <VerticalRightOutlined />,
        key: "current",
      },
      {
        label: intl.formatMessage({
          id: `tabs.close.left`,
          defaultMessage: '关闭左侧',
        }),
        icon: <VerticalRightOutlined />,
        key: 'left',
      },
      {
        label: intl.formatMessage({
          id: `tabs.close.right`,
          defaultMessage: '关闭右侧',
        }),
        icon: <VerticalLeftOutlined />,
        key: 'right',
      },
      {
        label: intl.formatMessage({
          id: `tabs.close.others`,
          defaultMessage: '关闭其他',
        }),
        icon: <CloseOutlined />,
        key: 'others',
      },
      {
        type: 'divider',
      },
      {
        label: intl.formatMessage({
          id: `tabs.refresh`,
          defaultMessage: '刷新',
        }),
        icon: <ReloadOutlined />,
        key: 'refresh',
      },
    ];

    const selectAction = ({ key }) => {
      switch (key) {
        //添加删除当前
        case "current":
          closeTab(activeKey);
          break;
        case 'left':
          dropLeftTabs(activeKey);
          break;

        case 'right':
          dropRightTabs(activeKey);
          break;

        case 'others':
          dropOtherTabs(activeKey);
          break;

        case 'refresh':
          refreshTab(activeKey);
          break;

        default:
          break;
      }
    };

    return (
      <div
        className="runtime-keep-alive-tabs-layout"
        hidden={!isKeep}
        style={{ height: '40px', marginBottom: '12px' }}
      >
        <Tabs
          tabBarExtraContent={
            <div
              style={{
                position: 'fixed',
                right: 0,
                transform: 'translateY(-50%)',
              }}
            >
              <Dropdown
                menu={ {items, onClick: selectAction} }
                trigger={['click']}
              >
                <Button
                  size="small"
                  icon={<EllipsisOutlined />}
                  style={{ marginRight: 12 }}
                />
              </Dropdown>
            </div>
          }
          hideAdd
          onChange={(key: string) => {
            const path = key.split(':')[0];
            const { pathname, hash, search } =
              keepElements.current[path].location;
            navigate(`${pathname}${search}${hash}`);
          }}
          renderTabBar={(props, DefaultTabBar) => (
            <div
              style={{
                position: 'fixed',
                zIndex: 10,
                padding: 0,
                width: '100%',
                background: initialState?.settings?.navTheme === 'realDark' ? 'black' : 'white',
              }}
            >
              <DefaultTabBar
                {...props}
                style={{
                  marginBottom: 0,
                }}
              />
            </div>
          )}
          activeKey={`${activeKey}::${tabNameMap[location.pathname]}`}
          type="editable-card"
          onEdit={(key: string) => {
            // 因为下方的 key 拼接了 tabNameMap[location.pathname]
            const targetKey = key.split('::')[0];
            closeTab(targetKey);
          }}
          {...tabProps}
          items={Object.entries(keepElements.current).map(([pathname, {name, icon, closable, children, ...other}]: any) => ({
            label: <>{icon}{name}</>,
            key: `${pathname?.toLowerCase()}::${tabNameMap[pathname?.toLowerCase()]}`,
            closable: Object.entries(keepElements.current).length === 1 ? false : closable,
            style: { paddingTop: '20px' },
            ...other
          }))}
        >
         
        </Tabs>
      </div>
    );
  };
};
