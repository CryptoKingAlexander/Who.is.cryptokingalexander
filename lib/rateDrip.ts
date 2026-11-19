/**
 * Global Request Queue to implement "Rate Drip" (Leaky Bucket / Token Bucket variant)
 * Ensures that requests are released to the server at a constant, sustainable rate
 * to eliminate 429 "rate exceeded" errors.
 */

type QueueItem<T = unknown> = {
  task: () => Promise<T>;
  resolve: (value: T) => void;
  reject: (reason?: unknown) => void;
};

export class DripQueue {
  private queue: QueueItem<any>[] = [];
  private isProcessing = false;
  private minIntervalMs: number;

  constructor(minIntervalMs: number = 1000) {
    this.minIntervalMs = minIntervalMs;
  }

  /**
   * Enqueue a task to be executed at the next available "drip" slot.
   */
  async enqueue<T>(task: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.queue.push({ task, resolve, reject });
      this.process();
    });
  }

  private async process() {
    if (this.isProcessing || this.queue.length === 0) return;

    this.isProcessing = true;

    while (this.queue.length > 0) {
      const item = this.queue.shift();
      if (item) {
        try {
          const result = await item.task();
          item.resolve(result);
        } catch (err) {
          item.reject(err);
        }
      }

      if (this.queue.length > 0) {
        // "Drip" wait before next task
        await new Promise((resolve) => setTimeout(resolve, this.minIntervalMs));
      }
    }

    this.isProcessing = false;
  }

  /**
   * Update the drip rate dynamically (interval in ms between outgoing requests)
   */
  setRate(minIntervalMs: number) {
    this.minIntervalMs = Math.max(50, minIntervalMs);
  }

  /**
   * Get current interval in ms
   */
  getRate(): number {
    return this.minIntervalMs;
  }

  /**
   * Get count of pending items currently waiting in the queue
   */
  getPendingCount(): number {
    return this.queue.length;
  }

  /**
   * Check if queue is currently actively processing items
   */
  isDripping(): boolean {
    return this.isProcessing;
  }

  /**
   * Clear all pending items without executing them
   */
  clear() {
    while (this.queue.length > 0) {
      const item = this.queue.shift();
      if (item) {
        item.reject(new Error('Rate drip queue cleared.'));
      }
    }
  }
}

// Singleton instances for different domains
export const globalAIDripQueue = new DripQueue(2000);  // 1 request every 2s for LLM/Gemini APIs
export const globalAPIDripQueue = new DripQueue(500);   // 1 request every 500ms for general APIs

/**
 * Universal helper to execute any async operation through a rate drip queue
 */
export async function dripCall<T>(
  task: () => Promise<T>,
  queue: DripQueue = globalAPIDripQueue
): Promise<T> {
  return queue.enqueue(task);
}
