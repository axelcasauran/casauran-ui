import type {
  VirtualAnchor,
  VirtualAxis,
  VirtualAxisMutation,
  VirtualMeasurement,
} from './axis.js';

export type MeasurementDimension = 'block' | 'inline';

export interface ResizeObserverLike {
  observe(target: Element, options?: ResizeObserverOptions): void;
  unobserve(target: Element): void;
  disconnect(): void;
}

export interface ResizeObserverConstructorLike {
  new (callback: ResizeObserverCallback): ResizeObserverLike;
}

export interface ElementMeasurementObserverOptions {
  readonly axis: VirtualAxis;
  readonly ResizeObserver: ResizeObserverConstructorLike;
  readonly dimension?: MeasurementDimension;
  readonly box?: ResizeObserverBoxOptions;
  readonly getAnchor?: () => VirtualAnchor | undefined;
  readonly onMeasure?: (mutation: VirtualAxisMutation) => void;
}

export interface ElementMeasurementObserver {
  observe(element: Element, index: number): void;
  unobserve(element: Element): void;
  disconnect(): void;
}

const readEntrySize = (entry: ResizeObserverEntry, dimension: MeasurementDimension): number => {
  const borderSize = entry.borderBoxSize[0];
  if (borderSize !== undefined) {
    return dimension === 'block' ? borderSize.blockSize : borderSize.inlineSize;
  }
  return dimension === 'block' ? entry.contentRect.height : entry.contentRect.width;
};

export const createElementMeasurementObserver = (
  options: ElementMeasurementObserverOptions,
): ElementMeasurementObserver => {
  const dimension = options.dimension ?? 'block';
  const box = options.box ?? 'border-box';
  const indexes = new WeakMap<Element, number>();
  const observer = new options.ResizeObserver((entries) => {
    const measurements: VirtualMeasurement[] = [];
    for (const entry of entries) {
      const index = indexes.get(entry.target);
      if (index !== undefined) measurements.push({ index, size: readEntrySize(entry, dimension) });
    }
    if (measurements.length === 0) return;
    const anchor = options.getAnchor?.();
    const mutation =
      anchor === undefined
        ? options.axis.measure(measurements)
        : options.axis.measure(measurements, anchor);
    options.onMeasure?.(mutation);
  });
  const measurementObserver: ElementMeasurementObserver = {
    observe(element: Element, index: number) {
      options.axis.getKey(index);
      indexes.set(element, index);
      observer.observe(element, { box });
    },
    unobserve(element: Element) {
      indexes.delete(element);
      observer.unobserve(element);
    },
    disconnect() {
      observer.disconnect();
    },
  };
  return Object.freeze(measurementObserver);
};
