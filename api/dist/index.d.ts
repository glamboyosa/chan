declare class Channel<T> {
    private bufferSize;
    private queue;
    private resolveQueue;
    private closed;
    constructor(bufferSize?: number);
    send(value: T): Promise<void>;
    receive(): Promise<T | null>;
    close(): void;
}

export { Channel };
