class Channel<T> {
  private queue: T[] = [];
  private resolveQueue: ((value: T | null) => void)[] = [];
  private closed = false;

  constructor(private bufferSize = 0) {}

  async send(value: T): Promise<void> {
    if (this.resolveQueue.length > 0) {
      const resolve = this.resolveQueue.shift();
      if (!resolve) {
        throw new Error("Expected an item in the resolveQueue but found none.");
      }
      resolve(value); // Resolve the pending promise with the value
    } else if (this.queue.length < this.bufferSize) {
      this.queue.push(value); // Queue the value if the buffer isn't full
    } else {
      await new Promise<void>((resolve) => {
        this.resolveQueue.push(() => resolve()); // Add to the resolve queue
      });
      this.queue.push(value); // After promise resolves, queue the value
    }
  }

  async receive(): Promise<T | null> {
    if (this.queue.length > 0) {
      const val = this.queue.shift();
      if (!val) {
        throw new Error("Expected an item in the resolveQueue but found none.");
      }
      return val; // Return the next queued value
    }
    if (this.closed) {
      return null; // If channel is closed, return null
    }
    return new Promise<T | null>((resolve) => {
      this.resolveQueue.push(resolve); // Add to the resolve queue
    });
  }

  close(): void {
    this.closed = true;
    while (this.resolveQueue.length > 0) {
      const resolve = this.resolveQueue.shift();
      if (!resolve) {
        throw new Error("Expected an item in the resolveQueue but found none.");
      }
      resolve(null); // Resolve all pending receives with null
    }
  }
}

export { Channel };
