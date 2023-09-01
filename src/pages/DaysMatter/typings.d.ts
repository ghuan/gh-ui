export type TableListItem = {
  id?: number;
  title?: string;
  dateType?: number;
  date?: string;
  top?: number;
  repeat?: number;
  bigDay?: number;
  containBeginDate?: number;
  dateShow?: string;
};

export type ConfigItem = {
  id?: number;
  regularMinute?: number;
  thresholdDays?: number;
  clientWidth?: number;
  clientHeight?: number;
};

