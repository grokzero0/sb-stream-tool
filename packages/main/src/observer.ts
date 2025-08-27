export interface EventSink {
  update(...args: any[]): void;
}

export interface EventStream {
  attach(eventStream: EventSink): void;

  detach(eventStream: EventSink): void;

  notify(...args: any[]): void;
}
