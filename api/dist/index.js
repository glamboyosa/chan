"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// index.ts
var api_exports = {};
__export(api_exports, {
  Channel: () => Channel
});
module.exports = __toCommonJS(api_exports);

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Channel
});
//# sourceMappingURL=index.js.map