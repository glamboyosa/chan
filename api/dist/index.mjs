// client.ts
var Channel = class {
  constructor(bufferSize = 0) {
    this.bufferSize = bufferSize;
  }
  queue = [];
  resolveQueue = [];
  closed = false;
  async send(value) {
    if (this.resolveQueue.length > 0) {
      const resolve = this.resolveQueue.shift();
      if (!resolve) {
        throw new Error("Expected an item in the resolveQueue but found none.");
      }
      resolve(value);
    } else if (this.queue.length < this.bufferSize) {
      this.queue.push(value);
    } else {
      await new Promise((resolve) => {
        this.resolveQueue.push(() => resolve());
      });
      this.queue.push(value);
    }
  }
  async receive() {
    if (this.queue.length > 0) {
      const val = this.queue.shift();
      if (!val) {
        throw new Error("Expected an item in the resolveQueue but found none.");
      }
      return val;
    }
    if (this.closed) {
      return null;
    }
    return new Promise((resolve) => {
      this.resolveQueue.push(resolve);
    });
  }
  close() {
    this.closed = true;
    while (this.resolveQueue.length > 0) {
      const resolve = this.resolveQueue.shift();
      if (!resolve) {
        throw new Error("Expected an item in the resolveQueue but found none.");
      }
      resolve(null);
    }
  }
};
export {
  Channel
};
//# sourceMappingURL=index.mjs.map