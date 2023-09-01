
import { getLunarDate } from '../api';
import type { TableListItem } from '../typings';
import { useState, useRef } from 'react';
import { FormattedMessage, useIntl } from '@umijs/max';
import { CalendarOutlined } from '@ant-design/icons';
import { Button, Space, Input, Modal, Tooltip } from 'antd';
import {
  ModalForm,
  ProForm,
  ProFormCheckbox,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-form';
import type { ProFormInstance } from '@ant-design/pro-components';
import type { DraggableData, DraggableEvent } from 'react-draggable';
import Draggable from 'react-draggable';

type ModalFormProps = {
  open: boolean;
  current: Partial<TableListItem> | undefined;
  onCancel: () => void;
  onSubmit: (values: TableListItem) => void;
};
const SaveModalForm: React.FC<ModalFormProps> = (props) => {
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
    <ModalForm<TableListItem>
      open={open}
      formRef={formRef}
      width={600}
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
          {intl.formatMessage({ id: `${(current && current.id) ? 'pages.update' : 'pages.new'}`, })}
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
        <ProFormText
          name="title"
          label="标题"
          rules={[{ required: true, message: '请输入标题' }]}
          placeholder="请输入"
        />
        <ProForm.Group>
          <ProFormSelect
            options={[
              {
                value: 1,
                label: '公历',
              },
              {
                value: 2,
                label: '农历',
              },
            ]}
            initialValue={1}
            name="dateType"
            required
            rules={[{ required: true, message: '这是必填项' }]}
            label="日期类型"
            onChange={async (v) => {
              const date = formRef.current?.getFieldValue('date');
                if(date){
                  if(v==2){
                    let rs = await getLunarDate({date:date});
                    formRef.current.setFieldValue('dateShow',rs.data)
                  }else {
                    formRef.current.setFieldValue('dateShow',date)
                  }
                }
            }}
          />

          <ProFormSelect
            options={[
              {
                value: 0,
                label: '不重复',
              },
              {
                value: 1,
                label: '每天重复',
              },
              {
                value: 2,
                label: '每周重复',
              },
              {
                value: 3,
                label: '每月重复',
              },
              {
                value: 4,
                label: '每年重复',
              },
            ]}
            initialValue={0}
            name="repeat"
            required
            rules={[{ required: true, message: '这是必填项' }]}
            label="重复"
          />
          <ProFormText
            name="dateShow"
            id='dateShow'
            required
            rules={[{ required: true, message: '这是必填项' }]}
            disabled
            placeholder="请选择目标日期"
            label="目标日期"
            addonAfter={<a onClick={() => { showModal() }}>点击选择</a>}
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormCheckbox
            getValueProps={ value => ({ checked: value === 1, value }) }
            getValueFromEvent={ e => e.target.checked ? 1 : 0 }
            name="top"
           >
            置顶
            </ProFormCheckbox>
          <ProFormCheckbox
            getValueProps={ value => ({ checked: value === 1, value }) }
            getValueFromEvent={ e => e.target.checked ? 1 : 0 }
            name="bigDay"    
          >
            Big Day(周年和百日提醒)
          </ProFormCheckbox>
          <ProFormCheckbox
            getValueProps={ value => ({ checked: value === 1, value }) }
            getValueFromEvent={ e => e.target.checked ? 1 : 0 }
            name="containBeginDate"
          >
            正数包含起始日(+1天)
          </ProFormCheckbox>
        </ProForm.Group>

        <ProFormText
          name="id"
          hidden={true}
        />
        <ProFormText
          name="date"
          hidden={true}
        />
        <a hidden={true} id={'dateShowClick'} onClick={async (e) => { 
          setIsModalOpen(false);
          let v = e.target.innerHTML;
          let vs = v.split('@@');
          let date = vs[0];
          if(date){
            let ds = date.split('-');
            date = ds[0] + '-' + (parseInt(ds[1]) < 10 ? ('0'+ds[1]):ds[1]) + '-' + (parseInt(ds[2]) < 10 ? ('0'+ds[2]):ds[2])
            let desc = vs.length == 2 ? vs[1] : null;
            if(date){
              formRef.current.setFieldValue('date',date)
            }
            if(desc){
              if(!formRef.current?.getFieldValue('title')){
                formRef.current.setFieldValue('title',desc)
              }
            }
            if(formRef.current?.getFieldValue('dateType') == 2){
              let rs = await getLunarDate({date:date});
              formRef.current.setFieldValue('dateShow',rs.data)
            }else {
              formRef.current.setFieldValue('dateShow',date)
            }
          }
          
        }
          }>
            点击选择
          </a>
        <Modal
          title="日期选择(双击选择)"
          bodyStyle={{ height: 500 }}
          width={800}
          open={isModalOpen}
          okButtonProps={{
            style:{display:'none'}
          }}
          cancelButtonProps={{
            style:{display:'none'}
          }}
          onCancel={handleCancel}
        >
          <iframe id='dateSelect' style={{ border: 0, width: "100%", height: "100%" }} src={"/calendar/index.html?currentDate="+(formRef?.current?.getFieldValue('date')||"")+"&_ds="+(new Date().getTime())}></iframe>
        </Modal>
      </>
    </ModalForm>
  );
};

export default SaveModalForm;
