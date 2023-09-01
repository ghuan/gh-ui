import { save, remove, getPage,saveConfig,getConfig } from './api';
import type { TableListItem,ConfigItem } from './typings';
import { PlusOutlined,EditOutlined,DeleteOutlined,CheckOutlined,QuestionCircleOutlined,SettingFilled} from '@ant-design/icons';
import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import {
  FooterToolbar,
  ModalForm,
  PageContainer,
  ProDescriptions,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import { FormattedMessage, useIntl } from '@umijs/max';
import { Button, Drawer, Input,Tooltip,App  } from 'antd';
import React, { useRef, useState } from 'react';
import SaveModalForm from './components/SaveModalForm';
import ConfigSaveModalForm from './components/ConfigSaveModalForm';

const TableList: React.FC = () => {
  /**
   * @en-US The pop-up window of the distribution update window
   * @zh-CN 分布更新窗口的弹窗
   * */
  const [saveModalFormOpen, handleSaveModalFormOpen] = useState<boolean>(false);
  const [configSaveModalFormOpen, handleConfigSaveModalFormOpen] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<TableListItem>();
  const [configInfo, setConfigInfo] = useState<ConfigItem>();
  const [selectedRowsState, setSelectedRows] = useState<TableListItem[]>([]);

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();
  const { modal,message } = App.useApp();


  /**
 * @en-US Update node
 * @zh-CN 更新节点
 *
 * @param fields
 */
const handleSave = async (fields: TableListItem) => {
  const hide = message.loading('保存中...');
  try {
    await save(fields);
    hide();
    message.success('保存成功');
    return true;
  } catch (error) {
    hide();
    message.error('保存失败!');
    return false;
  }
};

/**
 *  Delete node
 * @zh-CN 删除节点
 *
 * @param selectedRows
 */
const handleRemove = async (selectedRows: TableListItem[]) => {
  
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  let ids:number[] = [];
  selectedRows.map((row) => ids.push(row?.id))
  try {
    await remove(ids);
    hide();
    message.success('删除成功');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
  
};


const handleConfigSave = async (fields: ConfigItem) => {
  const hide = message.loading('保存中...');
  try {
    await saveConfig(fields);
    hide();
    message.success('保存成功');
    return true;
  } catch (error) {
    hide();
    message.error('保存失败!');
    return false;
  }
};

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '标题',
      dataIndex: 'title'
    },
    {
      title: '日期类型',
      dataIndex: 'dateType',
      valueEnum: {
        1: '公历',
        2: '农历',
      },
    },
    {
      title: '目标日期',
      dataIndex: 'dateShow',
      hideInSearch:true
    },
    {
      title: '置顶',
      dataIndex: 'top',
      hideInSearch:true,
      render: (value, record) => {
        return value == 1 ? <CheckOutlined key={'ddd'}
        style={{color:'#419641',fontSize:'20px'}}
        /> : '';
      },
    },
    {
      title: 'bigDay(周年和百日提醒)',
      dataIndex: 'bigDay',
      hideInSearch:true,
      render: (value, record) => {
        return value == 1 ? <CheckOutlined key={'aaa'}
        style={{color:'#419641',fontSize:'20px'}}
        /> : '';
      },
    },
    {
      title: '正数包含起始日(+1)',
      dataIndex: 'containBeginDate',
      hideInSearch:true,
      render: (value, record) => {
        return value == 1 ? <CheckOutlined key={'bbb'}
        style={{color:'#419641',fontSize:'20px'}}
        /> : '';
      },
    },
    {
      title: '重复',
      dataIndex: 'repeat',
      hideInSearch:true,
      valueEnum: {
        0: '不重复',
        1: '每天重复',
        2: '每周重复',
        3: '每月重复',
        4: '每年重复',
      },
    },
    {
      title: '操作',
      width:80,
      dataIndex: 'option',
      valueType: 'option',
      fixed:'right',
      render: (_, record) => [
        <span key={'sp1'}>&nbsp;</span>,
        <Tooltip title="修改" key={'updateTooltip'}>
        <a
          key="update"
          onClick={() => {
            handleSaveModalFormOpen(true);
            setCurrentRow(record);
          }}
        >
          <EditOutlined />
        </a>
      </Tooltip>,
        <span key={'sp2'}>&nbsp;</span>,
        <Tooltip title="删除" key={'deleteTooltip'}>
        <a 
        onClick={async () => {
          modal.confirm({
            title:'确认删除？',
            content:'是否确认删除？',
            icon: <QuestionCircleOutlined />,
            onOk: async () => {
              await handleRemove([record]);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            },
          });
        }}>
         <DeleteOutlined />
        </a>
      </Tooltip>,
        <span key={'sp3'}>&nbsp;</span>
      ],
    },
  ];

  return (
    <>
      <ProTable<TableListItem, API.PageParams>
        scroll={{ x: 1300 }}
        headerTitle='纪念日管理'
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleSaveModalFormOpen(true);
              setCurrentRow({});
            }}
          >
            <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
          </Button>,
          <Button
          type="primary"
          key="primary"
          onClick={async () => {
            const {data} = await getConfig();
            handleConfigSaveModalFormOpen(true);
            setConfigInfo(data);
          }}
        >
          <SettingFilled /> 客户端配置
        </Button>,
        ]}
        request={async (
          // 第一个参数 params 查询表单和 params 参数的结合
          // 第一个参数中一定会有 pageSize 和  current ，这两个参数是 antd 的规范
          params: API.PageParams
        ) => {
          // 这里需要返回一个 Promise,在返回之前你可以进行数据转化
          // 如果需要转化参数可以在这里进行修改
          const pm = {
            pageNum :params.current,
            ...params
          }
          const result = await getPage(pm);
          return {
            data: result?.data?.list || [],
            // success 请返回 true，
            // 不然 table 会停止解析数据，即使有数据
            success: true,
            // 不传会使用 data 的长度，如果是分页一定要传
            total: result?.data?.total || 0,
          };
        }}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
        tableAlertRender={false}
        // tableAlertRender={({
        //   selectedRowKeys,
        //   selectedRows,
        //   onCleanSelected,
        // }) => {
        //   console.log(selectedRowKeys, selectedRows);
        //   return (
        //     <Space size={24}>
        //       <span>
        //         已选 {selectedRowKeys.length} 项
        //         <a style={{ marginInlineStart: 8 }} onClick={onCleanSelected}>
        //           取消选择
        //         </a>
        //       </span>
        //     </Space>
        //   );
        // }}
        // tableAlertOptionRender={() => {
        //   return (
        //     <Space size={16}>
        //       <a>批量删除</a>
        //       <a>导出数据</a>
        //     </Space>
        //   );
        // }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              <FormattedMessage id="pages.searchTable.chosen" defaultMessage="Chosen" />{' '}
              <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}
              <FormattedMessage id="pages.searchTable.item" defaultMessage="项" />
              &nbsp;&nbsp;
              {/* <span>
                <FormattedMessage
                  id="pages.searchTable.totalServiceCalls"
                  defaultMessage="Total number of service calls"
                />{' '}
                {selectedRowsState.reduce((pre, item) => pre + item.callNo!, 0)}{' '}
                <FormattedMessage id="pages.searchTable.tenThousand" defaultMessage="万" />
              </span> */}
            </div>
          }
        >
          <Button type="primary"
            onClick={async () => {
              modal.confirm({
                title:'确认删除？',
                content:'是否确认删除？',
                icon: <QuestionCircleOutlined />,
                onOk: async () => {
                  await handleRemove(selectedRowsState);
                  setSelectedRows([]);
                  actionRef.current?.reloadAndRest?.();
                },
              });
            }}
          >
            <FormattedMessage
              id="pages.searchTable.batchDeletion"
              defaultMessage="Batch deletion"
            />
          </Button>
          
        </FooterToolbar>
      )}
      <SaveModalForm
        open={saveModalFormOpen}
        current={currentRow}
        onSubmit={async (value) => {
          const success = await handleSave(value);
          if (success) {
            handleSaveModalFormOpen(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleSaveModalFormOpen(false);
          setCurrentRow(undefined);
        }}
      />
      <ConfigSaveModalForm
        open={configSaveModalFormOpen}
        current={configInfo}
        onSubmit={async (value) => {
          const success = await handleConfigSave(value);
          if (success) {
            handleConfigSaveModalFormOpen(false);
            setConfigInfo(undefined);
          }
        }}
        onCancel={() => {
          handleConfigSaveModalFormOpen(false);
          setConfigInfo(undefined);
        }}
      />
      
    </>
  );
};

export default () => (
  <App>
    <TableList />
  </App>
);
