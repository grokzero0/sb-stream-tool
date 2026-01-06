/* eslint-disable @typescript-eslint/no-explicit-any */
export interface EventSink {
  update(...args: any[]): void
}

export interface EventStreamBase {
  attach(eventStream: EventSink): void

  detach(eventStream: EventSink): void

  notify(...args: any[]): void
}

export class EventStream {
  // list of EventSinks "attached" to this EventStream
  private observers: EventSink[]

  constructor() {
    this.observers = []
  }

  attach(newObserver: EventSink): void {
    this.observers.push(newObserver)
  }

  detach(observer: EventSink): void {
    const observerIndex = this.observers.indexOf(observer)
    if (observerIndex === -1) {
      return console.log(`No observer found at index ${observerIndex}`)
    }
    this.observers.splice(observerIndex, 1)
    console.log(`Detached an observer at index ${observerIndex}`)
  }

  notify(message?: string, description?: string): void {
    for (const observer of this.observers) {
      observer.update(message, description)
    }
  }
}
