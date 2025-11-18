/* eslint-disable @typescript-eslint/no-explicit-any */
export interface EventSink {
  update(...args: any[]): void
}

export interface EventStream {
  attach(eventStream: EventSink): void

  detach(eventStream: EventSink): void

  notify(...args: any[]): void
}
