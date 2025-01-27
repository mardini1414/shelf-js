import { useEffect, useRef } from 'react';
import DragAndDrop from '../core';
import { TUseShelfParams } from '../types';

export default function useShelf({ allowed, onOverClass, onChange }: TUseShelfParams = {}) {
  const ref = useRef<HTMLElement>(null);
  const dragAndDrop = useRef<DragAndDrop | null>(null);

  useEffect(() => {
    if (dragAndDrop.current === null) {
      dragAndDrop.current = new DragAndDrop({
        containerElement: ref.current,
        allowed,
        onOverClass,
        onChange,
      });
    }

    dragAndDrop.current?.setAllowed(allowed);
    dragAndDrop.current?.init();

    return () => {
      dragAndDrop.current?.destroy();
    };
  }, [allowed, onOverClass, onChange]);

  return [ref];
}
