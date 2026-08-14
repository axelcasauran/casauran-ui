'use client';

import {
  createAutoScroller,
  createDragSession,
  createDropTargetRegistry,
  createPointerDragController,
  type DragCompletion,
  type DragSession,
  type DropTargetRegistry,
} from '@casauran-internal/drag-drop';
import { useEffect, useRef, useState } from 'react';

type ProbeSession = DragSession<string, string>;
type ProbeTargets = DropTargetRegistry<string, string>;

const pointAtCenter = (element: HTMLElement) => {
  const rect = element.getBoundingClientRect();
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
};

const targetRect = (element: HTMLElement) => {
  const rect = element.getBoundingClientRect();
  return { x: rect.left, y: rect.top, width: rect.width, height: rect.height };
};

const completionText = (completion: DragCompletion<string, string>) =>
  completion.kind === 'dropped'
    ? completion.input.concat(':', String(completion.target?.id ?? 'none'))
    : `${completion.input}:${completion.reason ?? 'cancelled'}`;

export default function DragDropClientProbe() {
  const sourceRef = useRef<HTMLButtonElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const targetsRef = useRef<ProbeTargets | null>(null);
  const sessionRef = useRef<ProbeSession | null>(null);
  if (targetsRef.current === null) targetsRef.current = createDropTargetRegistry<string, string>();
  if (sessionRef.current === null) {
    sessionRef.current = createDragSession({ targets: targetsRef.current, activationDistance: 6 });
  }
  const targets = targetsRef.current;
  const session = sessionRef.current;
  const [phase, setPhase] = useState('idle');
  const [activeTarget, setActiveTarget] = useState('none');
  const [completion, setCompletion] = useState('none');
  const [touchType, setTouchType] = useState('none');
  const [scrollTop, setScrollTop] = useState(0);

  useEffect(() => {
    const source = sourceRef.current;
    const target = targetRef.current;
    const viewport = viewportRef.current;
    if (source === null || target === null || viewport === null) return;
    const registration = targets.register({
      id: 'drop-zone',
      data: 'accepted',
      rect: () => targetRect(target),
    });
    const scroller = createAutoScroller({
      environment: {
        requestAnimationFrame: (callback) => {
          return requestAnimationFrame(callback);
        },
        cancelAnimationFrame: (handle) => {
          cancelAnimationFrame(handle);
        },
      },
      getContainers: () => [
        {
          getRect: () => targetRect(viewport),
          getMetrics: () => ({
            scrollLeft: viewport.scrollLeft,
            scrollTop: viewport.scrollTop,
            scrollWidth: viewport.scrollWidth,
            scrollHeight: viewport.scrollHeight,
            clientWidth: viewport.clientWidth,
            clientHeight: viewport.clientHeight,
          }),
          scrollBy: (delta: { readonly x: number; readonly y: number }) => {
            viewport.scrollLeft += delta.x;
            viewport.scrollTop += delta.y;
            setScrollTop(Math.round(viewport.scrollTop));
          },
        },
      ],
      edgeThreshold: 45,
      maxSpeed: 900,
    });
    const controller = createPointerDragController({
      element: source,
      session,
      getPayload: () => 'client-payload',
      onSnapshot: (snapshot) => {
        setPhase(snapshot.phase);
        setActiveTarget(String(snapshot.target?.id ?? 'none'));
        scroller.updatePointer(snapshot.phase === 'dragging' ? snapshot.current : null);
      },
      onComplete: (result) => {
        scroller.stop();
        setPhase('idle');
        setActiveTarget('none');
        setCompletion(completionText(result));
      },
    });
    return () => {
      controller.dispose();
      scroller.dispose();
      registration.dispose();
    };
  }, [session, targets]);

  return (
    <section aria-label="Drag and drop client interaction">
      <p data-testid="drag-phase">{phase}</p>
      <p data-testid="drag-target">{activeTarget}</p>
      <p data-testid="drag-completion">{completion}</p>
      <p data-testid="drag-touch-type">{touchType}</p>
      <p data-testid="drag-scroll-top">{scrollTop}</p>
      <div
        ref={viewportRef}
        data-testid="drag-scroll-viewport"
        style={{
          position: 'relative',
          inlineSize: 420,
          blockSize: 180,
          overflow: 'auto',
          border: '1px solid currentColor',
        }}
      >
        <div style={{ position: 'relative', inlineSize: 400, blockSize: 800 }}>
          <button
            ref={sourceRef}
            data-testid="drag-source"
            style={{
              position: 'absolute',
              insetInlineStart: 20,
              insetBlockStart: 30,
              inlineSize: 100,
              blockSize: 50,
              touchAction: 'none',
            }}
            onKeyDown={(event) => {
              if (event.nativeEvent.isComposing || event.altKey || event.ctrlKey || event.metaKey)
                return;
              if (
                (event.key === ' ' || event.key === 'Enter') &&
                session.getSnapshot().phase === 'idle'
              ) {
                event.preventDefault();
                const snapshot = session.beginKeyboard({
                  point: pointAtCenter(event.currentTarget),
                  payload: 'client-payload',
                });
                setPhase(snapshot.phase);
                setActiveTarget(String(snapshot.target?.id ?? 'none'));
                return;
              }
              if (event.key === 'ArrowRight' && session.getSnapshot().input === 'keyboard') {
                event.preventDefault();
                const snapshot = session.moveKeyboardBy({ x: 80, y: 0 });
                setActiveTarget(String(snapshot.target?.id ?? 'none'));
              } else if (
                (event.key === 'Enter' || event.key === ' ') &&
                session.getSnapshot().input === 'keyboard'
              ) {
                event.preventDefault();
                setCompletion(completionText(session.dropKeyboard()));
                setPhase('idle');
                setActiveTarget('none');
              } else if (event.key === 'Escape' && session.getSnapshot().input === 'keyboard') {
                event.preventDefault();
                const result = session.cancel();
                if (result !== null) setCompletion(completionText(result));
                setPhase('idle');
                setActiveTarget('none');
              }
            }}
          >
            Drag source
          </button>
          <div
            ref={targetRef}
            data-testid="drag-drop-zone"
            style={{
              position: 'absolute',
              insetInlineStart: 260,
              insetBlockStart: 25,
              inlineSize: 110,
              blockSize: 60,
              border: '2px dashed currentColor',
            }}
          >
            Drop zone
          </div>
          <button
            data-testid="drag-touch-probe"
            style={{ position: 'absolute', insetInlineStart: 20, insetBlockStart: 120 }}
            onPointerDown={(event) => {
              setTouchType(event.pointerType);
            }}
          >
            Touch probe
          </button>
        </div>
      </div>
    </section>
  );
}
