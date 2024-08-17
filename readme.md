# @glamboyosa/chan

`@glamboyosa/chan` is a TypeScript package that implements channels similar to Go’s channels. Channels are a powerful concurrency primitive that enable safe and efficient communication between different parts of your application. This package is designed for use in various JavaScript environments, including Node.js.

## Motivation

The goal of this package is to bring the simplicity and power of Go's channels to TypeScript, offering a familiar concurrency tool for JavaScript developers. Channels facilitate:

- **Concurrency Management:** Efficiently handle asynchronous operations and communication.
- **Synchronization:** Coordinate between different parts of an application.
- **Buffering:** Manage tasks with buffering capabilities to handle scenarios where producers generate values faster than consumers can process them.

## Installation

You can install the package using `pnpm`:

```bash
pnpm add @glamboyosa/chan
```

## API

### `Channel<T>`

A class representing a channel for sending and receiving values of type `T`.

- **`constructor(bufferSize: number = 0)`**: Creates a new channel. Optionally specify a buffer size for buffered channels.

#### Methods

- **`send(value: T): Promise<void>`**

  Sends a value to the channel. If the channel is closed, it throws an error.

- **`receive(): Promise<T>`**

  Receives a value from the channel. If the channel is closed and empty, it throws an error.

- **`close(): void`**

  Closes the channel, signaling that no more values will be sent.

## Minimal Example

```typescript
import { Channel } from "@glamboyosa/chan";

const channel = new Channel<number>();

async function example() {
  // Send a value to the channel
  await channel.send(1);

  // Receive the value from the channel
  const value = await channel.receive();
  console.log(value); // Should log 1

  // Close the channel after all operations are complete
  channel.close();
}

example();
```

### Simple Worker Pool Example

```typescript
import { Channel } from "@glamboyosa/chan";

const jobChannel = new Channel<number>();

async function worker(id: number) {
  while (true) {
    const job = await jobChannel.receive();
    if (job === undefined) break; // Exit if the channel is closed
    console.log(`Worker ${id} received job ${job}`);
    // Simulate work
    await new Promise((res) => setTimeout(res, 1000));
    console.log(`Worker ${id} finished job ${job}`);
  }
}

async function producer() {
  for (let i = 1; i <= 5; i++) {
    console.log(`Producing job ${i}`);
    await jobChannel.send(i);
  }
  jobChannel.close(); // Close the channel when all jobs are produced
}

worker(1);
worker(2);
worker(3);
producer();
```

This example illustrates a simple worker pool pattern where multiple workers consume jobs from a shared channel. Once all jobs are produced, the channel is closed to signal workers to stop.

### Fan-Out/Fan-In Example

```typescript
import { Channel } from "@glamboyosa/chan";

const jobChannel = new Channel<number>();
const resultChannel = new Channel<number>();

async function worker(id: number) {
  while (true) {
    const job = await jobChannel.receive();
    if (job === undefined) break;
    console.log(`Worker ${id} processing job ${job}`);
    // Process job
    const result = job * 2; // Example processing
    await resultChannel.send(result);
  }
}

async function fanIn() {
  let count = 0;
  while (true) {
    const result = await resultChannel.receive();
    if (result === undefined) break;
    console.log(`Received result: ${result}`);
    count++;
    if (count === 5) break;
  }
  resultChannel.close(); // Close the result channel when done
}

async function producer() {
  for (let i = 1; i <= 5; i++) {
    console.log(`Producing job ${i}`);
    await jobChannel.send(i);
  }
  jobChannel.close(); // Close the job channel when done
}

worker(1);
worker(2);
fanIn(); // Collect results
producer();
```

This example demonstrates a fan-out/fan-in pattern. Multiple workers process jobs from a job channel, and results are sent to a result channel. Once all jobs are processed, the result channel is closed.

### Buffered Channels

Buffered channels allow sending multiple items into a channel before they are consumed. More precisely, buffered channels provide a fixed-size buffer where values can be temporarily stored. This means values can be sent into the channel without requiring an immediate receiver.

When the buffer is full, further sends will block until there is space available. This buffering mechanism is particularly useful when producers generate values faster than consumers can process them.

To use buffered channels, specify the buffer size when constructing the channel:

```typescript
const bufferedChannel = new Channel<number>(2); // Creates a buffered channel with a capacity of 2
```

### Buffering Example

```typescript
import { Channel } from "@glamboyosa/chan";

const bufferedChannel = new Channel<number>(2);

async function producer() {
  await bufferedChannel.send(1);
  await bufferedChannel.send(2);
  console.log("Buffer is full, sending will block...");
  await bufferedChannel.send(3); // This will block until a value is received
  console.log("Sent 3");
}

async function consumer() {
  await new Promise((res) => setTimeout(res, 1000));
  console.log(await bufferedChannel.receive()); // Receives 1
  console.log(await bufferedChannel.receive()); // Receives 2
  console.log(await bufferedChannel.receive()); // Receives 3
}

producer();
consumer();
```

This example shows how buffered channels allow a producer to send values into the channel even when there are no immediate receivers, blocking only when the buffer is full.
Got it! Here’s a more concise **Contributing** section:

---

## Contributing

We welcome contributions to `@glamboyosa/chan`! If you’d like to contribute, please feel free to submit a pull request or open an issue to discuss potential changes.
