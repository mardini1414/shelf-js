import { DRAGGABLE_SELECTOR, DROPPABLE_SELECTOR, IS_DRAGGING_SELECTOR } from '../constants';
import { TShelfData, TConstructor } from '../types';

export class DragAndDrop {
  private containerElement: HTMLDivElement | null;
  private dataKey: string | null = null;
  private dataItemKey: string | null = null;
  private dataItemIndex: number | null = null;
  private allowed?: string;
  private onOverClass?: string;
  private onChange?: ((data: TShelfData) => void) | null;
  private onDragOver: (event: Event) => void;
  private onDragLeave: (event: Event) => void;
  private onDrop: (event: Event) => void;
  private onDragStart: (event: Event) => void;
  private onDragEnd: (event: Event) => void;

  public constructor({ containerElement, allowed, onOverClass, onChange }: TConstructor) {
    this.checkContainerElement(containerElement);
    this.containerElement = containerElement;
    this.allowed = allowed;
    this.onOverClass = onOverClass;
    this.onChange = onChange;
    this.onDragOver = () => {};
    this.onDragLeave = () => {};
    this.onDrop = () => {};
    this.onDragStart = () => {};
    this.onDragEnd = () => {};
  }

  public init() {
    this.addEvenListenerToDroppableElement();
    this.addEventListenerToDraggableElement();
  }

  public destroy() {
    this.removeEvenListenerFromDroppableElement();
    this.removeEventListenerFromDraggableElement();
  }

  public setAllowed(allowed?: string) {
    this.allowed = allowed;
  }

  private addEvenListenerToDroppableElement() {
    const droppables = this.containerElement?.querySelectorAll(
      DROPPABLE_SELECTOR,
    ) as NodeListOf<HTMLDivElement>;

    droppables?.forEach((droppable) => {
      this.onDragOver = (event) => this.moveElement(droppable, event);
      droppable.addEventListener('dragover', this.onDragOver);
    });

    droppables?.forEach((droppable) => {
      this.onDragLeave = () => this.removeOverClass(droppable);
      droppable.addEventListener('dragleave', this.onDragLeave);
    });

    droppables?.forEach((droppable) => {
      this.onDrop = () => this.removeOverClass(droppable);
      droppable.addEventListener('drop', this.onDrop);
    });
  }

  private removeEvenListenerFromDroppableElement() {
    const droppables = this.containerElement?.querySelectorAll(
      DROPPABLE_SELECTOR,
    ) as NodeListOf<HTMLDivElement>;

    droppables?.forEach((droppable) => {
      droppable.removeEventListener('dragover', this.onDragOver);
    });

    droppables?.forEach((droppable) => {
      droppable.removeEventListener('dragleave', this.onDragLeave);
    });

    droppables?.forEach((droppable) => {
      droppable.removeEventListener('drop', this.onDrop);
    });
  }

  private addEventListenerToDraggableElement() {
    this.onDragStart = (event) => this.addAttributeIsDragging(event);
    this.onDragEnd = (event) => this.removeAttributeIsDragging(event);
    document.addEventListener('dragstart', this.onDragStart);
    document.addEventListener('dragend', this.onDragEnd);
  }

  private removeEventListenerFromDraggableElement() {
    document.removeEventListener('dragstart', this.onDragStart);
    document.removeEventListener('dragend', this.onDragEnd);
  }

  private moveElement(element: HTMLDivElement | null, event: Event) {
    const droppableElement = element;
    const draggableElement = document.querySelector(IS_DRAGGING_SELECTOR) as HTMLDivElement | null;
    const allowedKey = draggableElement?.getAttribute('shelf-data-allowed-key') ?? undefined;
    const isDisabled = draggableElement?.getAttribute('draggable') === 'false';
    const isAllowed = allowedKey === this.allowed;

    if (!isAllowed || isDisabled) return;

    event.preventDefault();

    const clientY = (event as DragEvent).y;
    const afterElement = this.getDragAfterElement(droppableElement, clientY);

    if (draggableElement !== null && droppableElement) {
      this.getMetaData(droppableElement);
      this.addOverClass(droppableElement);
      draggableElement.style.opacity = '0';
    }

    if (draggableElement !== null && afterElement === null) {
      droppableElement?.appendChild(draggableElement as HTMLDivElement);
    }

    if (draggableElement !== null && afterElement !== null) {
      droppableElement?.insertBefore(draggableElement as HTMLDivElement, afterElement);
    }
  }

  private getMetaData(element: HTMLDivElement) {
    const children = element.children;
    const arrayChildren = [...children];

    this.dataKey = element.getAttribute('shelf-data-key');

    this.dataItemKey =
      arrayChildren
        .find((child) => child?.hasAttribute('shelf-data-is-draging'))
        ?.getAttribute('shelf-data-item-key') || null;

    this.dataItemIndex = arrayChildren.findIndex((child) =>
      child.hasAttribute('shelf-data-is-draging'),
    );
  }

  private addOverClass(element: HTMLDivElement | null) {
    if (this.onOverClass) {
      element?.classList.add(this.onOverClass);
    }
  }

  private removeOverClass(element: HTMLDivElement | null) {
    if (this.onOverClass) {
      element?.classList.remove(this.onOverClass);
    }
  }

  private addAttributeIsDragging(event: Event) {
    const element = event.target as HTMLDivElement;
    const isDraggable = element.getAttribute('shelf-data') === 'draggable';
    if (isDraggable) {
      element.setAttribute('shelf-data-is-draging', 'true');
    }
  }

  private removeAttributeIsDragging(event: Event) {
    const element = (event.target as HTMLDivElement) || null;
    const isDraggable = element.getAttribute('shelf-data') === 'draggable';

    if (this.dataItemIndex !== null && this.onChange) {
      this.onChange({
        dataKey: this.dataKey,
        dataItemKey: this.dataItemKey,
        dataItemIndex: this.dataItemIndex,
      });

      this.dataKey = null;
      this.dataItemKey = null;
      this.dataItemIndex = null;
    }

    if (isDraggable) {
      element.removeAttribute('shelf-data-is-draging');
      element.style.opacity = '1';
    }
  }

  private getDragAfterElement(element: HTMLDivElement | null, clientY: number) {
    if (!element) return null;
    const selector = `${DRAGGABLE_SELECTOR}:not(${IS_DRAGGING_SELECTOR})`;
    const draggables = [...element.querySelectorAll(selector)] as HTMLDivElement[];

    return draggables.reduce<{
      offset: number;
      element: HTMLDivElement | null;
    }>(
      (closest, child) => {
        const clientRect = child.getBoundingClientRect();
        const offset = clientY - (clientRect.top + clientRect.height / 2);

        if (offset < 0 && offset > closest.offset) {
          return { offset, element: child };
        } else {
          return closest;
        }
      },
      { offset: Number.NEGATIVE_INFINITY, element: null },
    ).element;
  }

  private checkContainerElement(element: HTMLDivElement | null) {
    if (!element) {
      throw Error('Container not exists');
    }
  }
}
