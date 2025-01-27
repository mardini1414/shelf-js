import { TDraggableProps } from '../types';

export default function Draggable({
  children,
  className,
  itemKey,
  allowedKey,
  disabled = false,
}: TDraggableProps) {
  return (
    <div
      shelf-data="draggable"
      shelf-data-allowed-key={allowedKey}
      shelf-data-item-key={itemKey}
      className={className}
      draggable={!disabled}
    >
      {children}
    </div>
  );
}
