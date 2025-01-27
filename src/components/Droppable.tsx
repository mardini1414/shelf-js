import { TDroppableProps } from '../types';

export default function Dropable({ children, className, shelfKey }: TDroppableProps) {
  return (
    <div shelf-data="droppable" shelf-data-key={shelfKey} className={className}>
      {children}
    </div>
  );
}
