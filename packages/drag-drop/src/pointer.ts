import { type DragPoint } from './geometry.js';
import {
  type DragCancelReason,
  type DragCompletion,
  type DragSession,
  type DragSnapshot,
} from './session.js';

export interface PointerCaptureElementLike {
  addEventListener(type: string, listener: EventListener): void;
  removeEventListener(type: string, listener: EventListener): void;
  setPointerCapture(pointerId: number): void;
  releasePointerCapture(pointerId: number): void;
  hasPointerCapture?(pointerId: number): boolean;
}

export interface PointerDragControllerOptions<TPayload, TTargetData> {
  readonly element: PointerCaptureElementLike;
  readonly session: DragSession<TPayload, TTargetData>;
  readonly getPayload: (event: PointerEvent) => TPayload;
  readonly onSnapshot: (snapshot: DragSnapshot<TPayload, TTargetData>) => void;
  readonly onComplete: (completion: DragCompletion<TPayload, TTargetData>) => void;
  readonly preventDefault?: boolean;
}

export interface PointerDragController {
  cancel(reason?: DragCancelReason): void;
  dispose(): void;
}

const eventPoint = (event: PointerEvent): DragPoint => ({ x: event.clientX, y: event.clientY });

export const createPointerDragController = <TPayload, TTargetData>(
  options: PointerDragControllerOptions<TPayload, TTargetData>,
): PointerDragController => {
  let disposed = false;
  let ownedPointerId: number | null = null;
  const shouldPreventDefault = options.preventDefault ?? true;

  const releaseCapture = (pointerId: number): void => {
    if (options.element.hasPointerCapture?.(pointerId) === false) return;
    try {
      options.element.releasePointerCapture(pointerId);
    } catch {
      // Capture can already be released by the user agent during cancellation or disconnection.
    }
  };

  const finish = (completion: DragCompletion<TPayload, TTargetData> | null): void => {
    const pointerId = ownedPointerId;
    ownedPointerId = null;
    if (pointerId !== null) releaseCapture(pointerId);
    if (completion !== null) options.onComplete(completion);
  };

  const pointerDown = (rawEvent: Event): void => {
    if (disposed) return;
    const event = rawEvent as PointerEvent;
    if (!event.isPrimary || event.button !== 0 || options.session.getSnapshot().phase !== 'idle')
      return;
    if (
      !options.session.beginPointer({
        pointerId: event.pointerId,
        pointerType: event.pointerType,
        isPrimary: event.isPrimary,
        button: event.button,
        point: eventPoint(event),
        payload: options.getPayload(event),
      })
    ) {
      return;
    }
    ownedPointerId = event.pointerId;
    try {
      options.element.setPointerCapture(event.pointerId);
    } catch {
      finish(options.session.cancel('capture-lost'));
      return;
    }
    if (shouldPreventDefault) event.preventDefault();
    options.onSnapshot(options.session.getSnapshot());
  };

  const pointerMove = (rawEvent: Event): void => {
    const event = rawEvent as PointerEvent;
    if (disposed || event.pointerId !== ownedPointerId) return;
    if (shouldPreventDefault) event.preventDefault();
    options.onSnapshot(options.session.movePointer(event.pointerId, eventPoint(event)));
  };

  const pointerUp = (rawEvent: Event): void => {
    const event = rawEvent as PointerEvent;
    if (disposed || event.pointerId !== ownedPointerId) return;
    if (shouldPreventDefault) event.preventDefault();
    finish(options.session.endPointer(event.pointerId));
  };

  const pointerCancel = (rawEvent: Event): void => {
    const event = rawEvent as PointerEvent;
    if (disposed || event.pointerId !== ownedPointerId) return;
    finish(options.session.cancel('pointer-cancelled'));
  };

  const lostPointerCapture = (rawEvent: Event): void => {
    const event = rawEvent as PointerEvent;
    if (disposed || event.pointerId !== ownedPointerId) return;
    finish(options.session.cancel('capture-lost'));
  };

  const listeners = [
    ['pointerdown', pointerDown],
    ['pointermove', pointerMove],
    ['pointerup', pointerUp],
    ['pointercancel', pointerCancel],
    ['lostpointercapture', lostPointerCapture],
  ] as const;
  for (const [type, listener] of listeners) options.element.addEventListener(type, listener);

  const cancel = (reason: DragCancelReason = 'cancelled'): void => {
    if (disposed && reason !== 'disposed') return;
    finish(options.session.cancel(reason));
  };

  return Object.freeze({
    cancel,
    dispose(): void {
      if (disposed) return;
      disposed = true;
      for (const [type, listener] of listeners) options.element.removeEventListener(type, listener);
      cancel('disposed');
    },
  });
};
