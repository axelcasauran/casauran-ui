export interface PreventableEvent {
  readonly defaultPrevented: boolean;
}

export type EventHandler<Event extends PreventableEvent> = (event: Event) => void;

/**
 * Runs the consumer handler first and skips owner behavior when the event is cancelled.
 */
export function composeEventHandlers<Event extends PreventableEvent>(
  consumerHandler: EventHandler<Event> | undefined,
  ownerHandler: EventHandler<Event>,
): EventHandler<Event> {
  return (event) => {
    consumerHandler?.(event);
    if (!event.defaultPrevented) ownerHandler(event);
  };
}
