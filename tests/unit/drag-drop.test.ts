import { describe, expect, expectTypeOf, it, vi } from 'vitest';

import {
  calculateAutoScrollDelta,
  createAutoScroller,
  createDragSession,
  createDropTargetRegistry,
  createPointerDragController,
  type AutoScrollContainer,
  type DragCompletion,
  type DragSession,
  type PointerCaptureElementLike,
} from '../../packages/drag-drop/src/index.js';

const rect = (x: number, y: number, width = 100, height = 100) => ({ x, y, width, height });

describe('drag sessions and target collision', () => {
  it('requires a primary button-zero pointer and activates at the exact threshold', () => {
    const targets = createDropTargetRegistry<string, string>();
    const session = createDragSession({ targets, activationDistance: 5 });
    expectTypeOf(session).toEqualTypeOf<DragSession<string, string>>();
    expect(
      session.beginPointer({
        pointerId: 1,
        pointerType: 'mouse',
        isPrimary: false,
        button: 0,
        point: { x: 0, y: 0 },
        payload: 'ignored',
      }),
    ).toBe(false);
    expect(
      session.beginPointer({
        pointerId: 1,
        pointerType: 'mouse',
        isPrimary: true,
        button: 0,
        point: { x: 0, y: 0 },
        payload: 'row-1',
      }),
    ).toBe(true);
    expect(session.movePointer(1, { x: 3, y: 3 }).phase).toBe('pending');
    const active = session.movePointer(1, { x: 3, y: 4 });
    expect(active.phase).toBe('dragging');
    expect(active.delta).toEqual({ x: 3, y: 4 });
    expect(Object.isFrozen(active)).toBe(true);
    expect(Object.isFrozen(active.delta)).toBe(true);
  });

  it('resolves deterministic pointer, intersection, and closest-center targets', () => {
    const targets = createDropTargetRegistry<{ allowed: boolean }, string>();
    targets.register({
      id: 'large',
      data: 'large',
      rect: () => rect(0, 0, 200, 200),
    });
    const small = targets.register({
      id: 'small',
      data: 'small',
      rect: () => rect(40, 40, 20, 20),
      accepts: (payload) => payload.allowed,
    });
    expect(targets.resolve({ payload: { allowed: true }, point: { x: 50, y: 50 } })?.id).toBe(
      'small',
    );
    expect(
      targets.resolve({
        payload: { allowed: false },
        point: { x: 50, y: 50 },
        dragRect: rect(45, 45, 50, 50),
        strategy: 'rectangle-intersection',
      })?.id,
    ).toBe('large');
    expect(
      targets.resolve({
        payload: { allowed: true },
        point: { x: 180, y: 180 },
        strategy: 'closest-center',
      })?.id,
    ).toBe('large');
    small.dispose();
    small.dispose();
    expect(targets.size).toBe(1);
  });

  it('completes pointer drops and cancels below-threshold sessions without a target', () => {
    const targets = createDropTargetRegistry<string, string>();
    targets.register({ id: 'drop', data: 'accepted', rect: () => rect(10, 0) });
    const session = createDragSession({ targets, activationDistance: 2 });
    session.beginPointer({
      pointerId: 7,
      pointerType: 'pen',
      isPrimary: true,
      button: 0,
      point: { x: 0, y: 0 },
      payload: 'opaque',
    });
    expect(session.endPointer(7)).toMatchObject({
      kind: 'cancelled',
      reason: 'threshold-not-met',
      target: null,
    });
    session.beginPointer({
      pointerId: 8,
      pointerType: 'touch',
      isPrimary: true,
      button: 0,
      point: { x: 0, y: 0 },
      payload: 'opaque',
    });
    expect(session.movePointer(99, { x: 50, y: 50 }).phase).toBe('pending');
    session.movePointer(8, { x: 20, y: 20 });
    expect(session.endPointer(8)).toMatchObject({
      kind: 'dropped',
      reason: null,
      target: { id: 'drop', data: 'accepted' },
    });
    expect(session.getSnapshot().phase).toBe('idle');
  });

  it('offers equivalent explicit keyboard movement, drop, and cancellation', () => {
    const targets = createDropTargetRegistry<string, string>();
    targets.register({ id: 'right', data: 'right', rect: () => rect(50, 0, 50, 50) });
    const session = createDragSession({ targets });
    session.beginKeyboard({ point: { x: 0, y: 25 }, payload: 'row-1' });
    expect(session.moveKeyboardBy({ x: 50, y: 0 }).target?.id).toBe('right');
    expect(session.dropKeyboard()).toMatchObject({ kind: 'dropped', input: 'keyboard' });
    session.beginKeyboard({ point: { x: 0, y: 0 }, payload: 'row-2' });
    expect(session.cancel()).toMatchObject({ kind: 'cancelled', reason: 'cancelled' });
  });
});

describe('pointer capture and autoscroll lifecycle', () => {
  it('owns Pointer Events capture, capture-loss cancellation, and listener cleanup', () => {
    const listeners = new Map<string, EventListener>();
    let captured: number | null = null;
    const element: PointerCaptureElementLike = {
      addEventListener: (type, listener) => listeners.set(type, listener),
      removeEventListener: (type) => listeners.delete(type),
      setPointerCapture: (pointerId) => {
        captured = pointerId;
      },
      releasePointerCapture: () => {
        captured = null;
      },
      hasPointerCapture: (pointerId) => captured === pointerId,
    };
    const targets = createDropTargetRegistry<string, string>();
    const session = createDragSession({ targets, activationDistance: 1 });
    const completions: DragCompletion<string, string>[] = [];
    let payloadCalls = 0;
    const controller = createPointerDragController({
      element,
      session,
      getPayload: () => {
        payloadCalls += 1;
        return 'payload';
      },
      onSnapshot: vi.fn(),
      onComplete: (completion) => completions.push(completion),
    });
    const dispatch = (type: string, properties: Partial<PointerEvent>) => {
      const event = Object.assign(new Event(type, { cancelable: true }), properties);
      listeners.get(type)?.(event);
    };
    dispatch('pointerdown', {
      pointerId: 3,
      pointerType: 'touch',
      isPrimary: false,
      button: 0,
      clientX: 0,
      clientY: 0,
    });
    expect(payloadCalls).toBe(0);
    dispatch('pointerdown', {
      pointerId: 4,
      pointerType: 'touch',
      isPrimary: true,
      button: 0,
      clientX: 0,
      clientY: 0,
    });
    expect(captured).toBe(4);
    expect(payloadCalls).toBe(1);
    dispatch('pointermove', { pointerId: 4, clientX: 2, clientY: 0 });
    dispatch('lostpointercapture', { pointerId: 4 });
    expect(completions).toEqual([
      expect.objectContaining({ kind: 'cancelled', reason: 'capture-lost' }),
    ]);
    controller.dispose();
    expect(listeners.size).toBe(0);
  });

  it('cancels deterministically when initial pointer capture is unavailable', () => {
    const listeners = new Map<string, EventListener>();
    const element: PointerCaptureElementLike = {
      addEventListener: (type, listener) => listeners.set(type, listener),
      removeEventListener: (type) => listeners.delete(type),
      setPointerCapture: () => {
        throw new DOMException('disconnected', 'NotFoundError');
      },
      releasePointerCapture: vi.fn(),
    };
    const completions: DragCompletion<string, never>[] = [];
    const controller = createPointerDragController({
      element,
      session: createDragSession({ targets: createDropTargetRegistry<string, never>() }),
      getPayload: () => 'payload',
      onSnapshot: vi.fn(),
      onComplete: (completion) => completions.push(completion),
    });
    const event = Object.assign(new Event('pointerdown'), {
      pointerId: 5,
      pointerType: 'mouse',
      isPrimary: true,
      button: 0,
      clientX: 0,
      clientY: 0,
    });
    listeners.get('pointerdown')?.(event);
    expect(completions).toEqual([
      expect.objectContaining({ kind: 'cancelled', reason: 'capture-lost' }),
    ]);
    controller.dispose();
  });

  it('bounds edge velocity by elapsed time and remaining scroll extent', () => {
    expect(
      calculateAutoScrollDelta({
        point: { x: 99, y: 99 },
        rect: rect(0, 0, 100, 100),
        metrics: {
          scrollLeft: 95,
          scrollTop: 90,
          scrollWidth: 200,
          scrollHeight: 200,
          clientWidth: 100,
          clientHeight: 100,
        },
        edgeThreshold: 20,
        maxSpeed: 1_000,
        elapsedMilliseconds: 16,
      }),
    ).toEqual({ x: 5, y: 10 });
    expect(
      calculateAutoScrollDelta({
        point: { x: 0, y: 0 },
        rect: rect(0, 0, 100, 100),
        metrics: {
          scrollLeft: 0,
          scrollTop: 0,
          scrollWidth: 200,
          scrollHeight: 200,
          clientWidth: 100,
          clientHeight: 100,
        },
        edgeThreshold: 20,
        maxSpeed: 1_000,
        elapsedMilliseconds: 16,
      }),
    ).toEqual({ x: -0, y: -0 });
  });

  it('schedules one frame, scrolls inner-to-outer per axis, and disposes explicitly', () => {
    let callback: FrameRequestCallback | null = null;
    let cancelled = false;
    const applied: Array<{ owner: string; x: number; y: number }> = [];
    const makeContainer = (owner: string, horizontal: boolean): AutoScrollContainer => ({
      getRect: () => rect(0, 0, 100, 100),
      getMetrics: () => ({
        scrollLeft: horizontal ? 10 : 0,
        scrollTop: horizontal ? 0 : 10,
        scrollWidth: horizontal ? 200 : 100,
        scrollHeight: horizontal ? 100 : 200,
        clientWidth: 100,
        clientHeight: 100,
      }),
      scrollBy: (delta) => applied.push({ owner, ...delta }),
    });
    const scroller = createAutoScroller({
      environment: {
        requestAnimationFrame: (next) => {
          callback = next;
          return 1;
        },
        cancelAnimationFrame: () => {
          cancelled = true;
        },
      },
      getContainers: () => [makeContainer('inner', false), makeContainer('outer', true)],
      edgeThreshold: 20,
      maxSpeed: 600,
    });
    scroller.updatePointer({ x: 99, y: 99 });
    expect(scroller.running).toBe(true);
    const firstFrame = callback as FrameRequestCallback | null;
    firstFrame?.(16);
    expect(applied.map(({ owner }) => owner)).toEqual(['inner', 'outer']);
    scroller.dispose();
    expect(cancelled).toBe(true);
    expect(scroller.running).toBe(false);
  });

  it('rejects invalid geometry and transports hostile payloads opaquely', () => {
    expect(() =>
      createDragSession({ targets: createDropTargetRegistry(), activationDistance: -1 }),
    ).toThrow(RangeError);
    expect(() =>
      calculateAutoScrollDelta({
        point: { x: Number.NaN, y: 0 },
        rect: rect(0, 0),
        metrics: {
          scrollLeft: 0,
          scrollTop: 0,
          scrollWidth: 100,
          scrollHeight: 100,
          clientWidth: 100,
          clientHeight: 100,
        },
        edgeThreshold: 20,
        maxSpeed: 1_000,
        elapsedMilliseconds: 16,
      }),
    ).toThrow(TypeError);
    const hostile = Object.freeze({ html: '<img src=x onerror=alert(1)>', __proto__: null });
    const session = createDragSession({
      targets: createDropTargetRegistry<typeof hostile, never>(),
    });
    session.beginKeyboard({ point: { x: 0, y: 0 }, payload: hostile });
    expect(session.dropKeyboard().payload).toBe(hostile);
  });
});
