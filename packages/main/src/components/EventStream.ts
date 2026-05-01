export interface EventSink {
  update(...args: any[]): void;
}

// export interface EventStreamBase {
//   attach(eventStream: EventSink): void;

//   detach(eventStream: EventSink): void;

//   notify(...args: any[]): void;
// }

// Use Event bus pattern if the EventStream needs both static and instance classes extended from this
// semi Event Bus pattern, the observer attaches to this, the subjects call this notify method
export class EventStream {
  // list of EventSinks "attached" to this EventStream
  private static observers: EventSink[] = [];

  static attach(newObserver: EventSink): void {
    this.observers.push(newObserver);
  }

  static detach(observer: EventSink): void {
    const observerIndex = this.observers.indexOf(observer);
    if (observerIndex === -1) {
      return console.log(`No observer found at index ${observerIndex}`);
    }
    this.observers.splice(observerIndex, 1);
    console.log(`Detached an observer at index ${observerIndex}`);
  }

  static notify(message?: string, description?: string): void {
    for (const observer of this.observers) {
      observer.update(message, description);
    }
  }
}
