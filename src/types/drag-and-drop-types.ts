export type TConstructor = {
  containerElement: HTMLDivElement | null;
  allowed?: string;
  onOverClass?: string;
  onChange?: (data: TShelfData) => void;
};

export type TShelfData = {
  dataKey: string | null;
  dataItemKey: string | null;
  dataItemIndex: number | null;
};
