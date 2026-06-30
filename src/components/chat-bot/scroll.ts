export function scrollNearestContainerToBottom(element: HTMLElement | null) {
  const container = getNearestScrollableContainer(element);

  if (container) {
    container.scrollTop = container.scrollHeight;
  }
}

export function getNearestScrollableContainer(element: HTMLElement | null) {
  let current = element?.parentElement ?? null;

  while (current) {
    const { overflowY } = window.getComputedStyle(current);
    const canScrollY = overflowY === 'auto' || overflowY === 'scroll';

    if (canScrollY) {
      return current;
    }

    current = current.parentElement;
  }

  return null;
}

export function isNearScrollBottom(element: HTMLElement) {
  return element.scrollHeight - element.scrollTop - element.clientHeight < 48;
}
