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
  private static observers: Map<string, EventSink[]> = new Map();

  static attach(eventType: string, newObserver: EventSink): void {
    if (!this.observers.has(eventType)) {
      this.observers.set(eventType, []);
    }
    this.observers.get(eventType)?.push(newObserver);
  }

  static detach(observer: EventSink): void {
    for (const [event, observers] of this.observers.entries()) {
      const observerIndex = observers.indexOf(observer);
      if (observerIndex !== -1) {
        observers.splice(observerIndex, 1);
        console.log(
          `Detached an observer at index ${observerIndex} from event "${event}"`,
        );
        return;
      }
    }
    console.log(`No observer found`);
  }

  static notify(eventType: string, ...args: any[]): void {
    const observers = this.observers.get(eventType);
    if (observers) {
      for (const observer of observers) {
        observer.update(...args);
      }
    }
  }
}
