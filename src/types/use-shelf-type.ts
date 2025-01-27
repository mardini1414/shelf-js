import { TShelfData } from './drag-and-drop-types';

export type TUseShelfParams = {
  allowed?: string;
  onOverClass?: string;
  onChange?: (data: TShelfData) => void;
};
