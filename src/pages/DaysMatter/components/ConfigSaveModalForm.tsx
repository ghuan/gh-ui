
import { getLunarDate } from '../api';
import type { ConfigItem } from '../typings';
import { useState, useRef } from 'react';
import { FormattedMessage, useIntl } from '@umijs/max';
import { CalendarOutlined } from '@ant-design/icons';
import { Tag, Space, Input, Modal, Tooltip } from 'antd';
import {
  ModalForm,
  ProForm,
  ProFormCheckbox,
  ProFormSelect,
  ProFormText,
  ProFormDigit,
} from '@ant-design/pro-form';
import type { ProFormInstance } from '@ant-design/pro-components';
import type { DraggableData, DraggableEvent } from 'react-draggable';
import Draggable from 'react-draggable';

type ModalFormProps = {
  open: boolean;
  current: Partial<ConfigItem> | undefined;
  onCancel: () => void;
  onSubmit: (values: ConfigItem) => void;
};
const ConfigSaveModalForm: React.FC<ModalFormProps> = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();
  const formRef = useRef<ProFormInstance>();
  const [bounds, setBounds] = useState({ left: 0, top: 0, bottom: 0, right: 0 });
  const [disabled, setDisabled] = useState(true);
  const draggleRef = useRef<HTMLDivElement>(null);
  const { open, current, onCancel, onSubmit } = props;
  if (!open) {
    return null;
  }
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const onStart = (_event: DraggableEvent, uiData: DraggableData) => {
    const { clientWidth, clientHeight } = window.document.documentElement;
    const targetRect = draggleRef.current?.getBoundingClientRect();
    if (!targetRect) {
      return;
    }
    setBounds({
      left: -targetRect.left + uiData.x,
      right: clientWidth - (targetRect.right - uiData.x),
      top: -targetRect.top + uiData.y,
      bottom: clientHeight - (targetRect.bottom - uiData.y),
    });
  };



  return (
    <ModalForm<ConfigItem>
      open={open}
      formRef={formRef}
      width={325}
      title={
        <div
          style={{
            width: '100%',
            cursor: 'move',
          }}
          onMouseOver={() => {
            if (disabled) {
              setDisabled(false);
            }
          }}
          onMouseOut={() => {
            setDisabled(true);
          }}
          // fix eslintjsx-a11y/mouse-events-have-key-events
          // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/mouse-events-have-key-events.md
          onFocus={() => { }}
          onBlur={() => { }}
        // end
        >
          客户端配置
        </div>
      }
      onInit={async (values) => {
        // formRef.current.setFieldValue('content',current?.content)
        // formRef.current.setFieldValue('stadiumId',values.stadiumId?values.stadiumId+'':null)

      }}
      onFinish={async (values) => {
        onSubmit(values);
      }}
      initialValues={current}
      modalProps={{
        onCancel: () => onCancel(),
        destroyOnClose: true,
        modalRender: (modal) => (
          <Draggable
            disabled={disabled}
            bounds={bounds}
            nodeRef={draggleRef}
            onStart={(event, uiData) => onStart(event, uiData)}
          >
            <div ref={draggleRef}>{modal}</div>
          </Draggable>
        )
      }
      }

    >
      <>
        <ProForm.Group>
          <ProFormDigit
            label="客户端-宽"
            width={'xs'}
            required
            rules={[{ required: true, message: '这是必填项' }]}
            name="clientWidth"
            min={1}
          />
          <ProFormDigit
            label="客户端-高"
            width={'xs'}
            required
            rules={[{ required: true, message: '这是必填项' }]}
            name="clientHeight"
            min={1}
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormDigit
            label="天数阈值"
            width={'xs'}
            required
            rules={[{ required: true, message: '这是必填项' }]}
            name="thresholdDays"
            min={1}
          />
          <ProFormDigit
            label="提醒间隔(次/分钟)"
            width={'xs'}
            required
            rules={[{ required: true, message: '这是必填项' }]}
            name="regularMinute"
            min={1}
          />
        </ProForm.Group>
        <Tag
          style={{
            width: '100%',
            whiteSpace: 'normal',
            wordBreak: 'break-all',
            wordWrap: 'break-word',
          }}
          color="volcano"
        >
          如果存在纪念日记录离目标日期的剩余天数小于等于提醒天数阈值，客户端将每隔提醒间隔分钟数弹窗提醒
        </Tag>


        <ProFormText
          name="id"
          hidden={true}
        />
      </>
    </ModalForm>
  );
};

export default ConfigSaveModalForm;
