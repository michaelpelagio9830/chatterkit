import { useCallback, useMemo, useRef, useState, type CSSProperties, type PointerEvent } from 'react';

const DEFAULT_LAUNCHER_SIZE = 56;
const DEFAULT_MARGIN = 24;
const DRAG_THRESHOLD_PX = 6;
const DEFAULT_PANEL_WIDTH = 448;
const DEFAULT_PANEL_HEIGHT = 584;

interface Position {
  x: number;
  y: number;
}

interface DragState {
  pointerId: number;
  startPointer: Position;
  startPosition: Position;
  hasDragged: boolean;
}

export interface UseChatBotWidgetOptions {
  defaultOpen?: boolean;
  draggable?: boolean;
}

export interface UseChatBotWidgetResult {
  isOpen: boolean;
  draggable: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  launcherStyle: CSSProperties | undefined;
  panelStyle: CSSProperties | undefined;
  launcherHandlers: {
    onClick: () => void;
    onPointerDown: (event: PointerEvent<HTMLButtonElement>) => void;
    onPointerMove: (event: PointerEvent<HTMLButtonElement>) => void;
    onPointerUp: (event: PointerEvent<HTMLButtonElement>) => void;
    onPointerCancel: (event: PointerEvent<HTMLButtonElement>) => void;
  };
}

function getDefaultPosition() {
  if (typeof window === 'undefined') {
    return { x: DEFAULT_MARGIN, y: DEFAULT_MARGIN };
  }

  return {
    x: Math.max(DEFAULT_MARGIN, window.innerWidth - DEFAULT_MARGIN - DEFAULT_LAUNCHER_SIZE),
    y: Math.max(DEFAULT_MARGIN, window.innerHeight - DEFAULT_MARGIN - DEFAULT_LAUNCHER_SIZE),
  };
}

function clampPosition(position: Position) {
  if (typeof window === 'undefined') {
    return position;
  }

  return {
    x: Math.min(
      Math.max(DEFAULT_MARGIN, position.x),
      Math.max(DEFAULT_MARGIN, window.innerWidth - DEFAULT_MARGIN - DEFAULT_LAUNCHER_SIZE),
    ),
    y: Math.min(
      Math.max(DEFAULT_MARGIN, position.y),
      Math.max(DEFAULT_MARGIN, window.innerHeight - DEFAULT_MARGIN - DEFAULT_LAUNCHER_SIZE),
    ),
  };
}

function clampPanelPosition(position: Position) {
  if (typeof window === 'undefined') {
    return position;
  }

  const panelWidth = Math.min(DEFAULT_PANEL_WIDTH, window.innerWidth - DEFAULT_MARGIN * 2);
  const panelHeight = Math.min(DEFAULT_PANEL_HEIGHT, window.innerHeight - DEFAULT_MARGIN * 2);

  return {
    x: Math.min(Math.max(DEFAULT_MARGIN, position.x), Math.max(DEFAULT_MARGIN, window.innerWidth - panelWidth - DEFAULT_MARGIN)),
    y: Math.min(Math.max(DEFAULT_MARGIN, position.y), Math.max(DEFAULT_MARGIN, window.innerHeight - panelHeight - DEFAULT_MARGIN)),
  };
}

export function useChatBotWidget(options: UseChatBotWidgetOptions = {}): UseChatBotWidgetResult {
  const { defaultOpen = false, draggable = false } = options;
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [position, setPosition] = useState<Position>(() => getDefaultPosition());
  const dragStateRef = useRef<DragState | null>(null);
  const shouldSuppressClickRef = useRef(false);

  const launcherStyle = useMemo(
    () =>
      draggable
        ? {
            left: `${position.x}px`,
            top: `${position.y}px`,
          }
        : undefined,
    [draggable, position],
  );

  const panelStyle = useMemo(() => {
    if (!draggable) {
      return undefined;
    }

    const panelPosition = clampPanelPosition(position);

    return {
      left: `${panelPosition.x}px`,
      top: `${panelPosition.y}px`,
    };
  }, [draggable, position]);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((current) => !current), []);

  const handlePointerDown = useCallback(
    (event: PointerEvent<HTMLButtonElement>) => {
      if (!draggable) {
        return;
      }

      const startPosition = clampPosition(position);
      dragStateRef.current = {
        pointerId: event.pointerId,
        startPointer: { x: event.clientX, y: event.clientY },
        startPosition,
        hasDragged: false,
      };
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    [draggable, position],
  );

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLButtonElement>) => {
      const dragState = dragStateRef.current;

      if (!draggable || !dragState || dragState.pointerId !== event.pointerId) {
        return;
      }

      const deltaX = event.clientX - dragState.startPointer.x;
      const deltaY = event.clientY - dragState.startPointer.y;
      const distance = Math.hypot(deltaX, deltaY);

      if (distance >= DRAG_THRESHOLD_PX) {
        dragState.hasDragged = true;
      }

      if (dragState.hasDragged) {
        event.preventDefault();
        setPosition(
          clampPosition({
            x: dragState.startPosition.x + deltaX,
            y: dragState.startPosition.y + deltaY,
          }),
        );
      }
    },
    [draggable],
  );

  const finishDrag = useCallback((event: PointerEvent<HTMLButtonElement>) => {
    const dragState = dragStateRef.current;

    if (!dragState || dragState.pointerId !== event.pointerId) {
      return;
    }

    shouldSuppressClickRef.current = dragState.hasDragged;
    dragStateRef.current = null;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }, []);

  const handleLauncherClick = useCallback(() => {
    if (shouldSuppressClickRef.current) {
      shouldSuppressClickRef.current = false;
      return;
    }

    open();
  }, [open]);

  const launcherHandlers = useMemo(
    () => ({
      onClick: handleLauncherClick,
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: finishDrag,
      onPointerCancel: finishDrag,
    }),
    [finishDrag, handleLauncherClick, handlePointerDown, handlePointerMove],
  );

  return {
    isOpen,
    draggable,
    open,
    close,
    toggle,
    launcherStyle,
    panelStyle,
    launcherHandlers,
  };
}