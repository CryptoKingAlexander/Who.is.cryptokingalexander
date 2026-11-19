/**
 * Utility for handling API rate limit (429) errors gracefully with backoff and rate drip.
 */

import { globalAPIDripQueue, DripQueue } from './rateDrip';

export interface RetryOptions {
  maxRetries?: number;
  initialDelayMs?: number;
  maxDelayMs?: number;
  useDrip?: boolean;
  dripQueue?: DripQueue;
}

/**
 * Fetch wrapper that enforces Rate Drip throttling before requests fire,
 * and handles 429 Too Many Requests responses using exponential backoff with jitter and Retry-After support.
 */
export async function fetchWithRateLimitRetry(
  url: string,
  options: RequestInit = {},
  retryOptions: RetryOptions = {}
): Promise<Response> {
  const { 
    maxRetries = 3, 
    initialDelayMs = 1000, 
    maxDelayMs = 8000,
    useDrip = true,
    dripQueue = globalAPIDripQueue
  } = retryOptions;

  let delay = initialDelayMs;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const callFetch = () => fetch(url, options);
      const response = useDrip 
        ? await dripQueue.enqueue(callFetch)
        : await callFetch();

      if (response.status === 429) {
        if (attempt === maxRetries) {
          throw new Error('Rate limit exceeded (HTTP 429). Server capacity saturated. System backoff active.');
        }

        // Check if server returned a Retry-After header
        const retryAfterHeader = response.headers.get('Retry-After');
        let waitMs = delay;

        if (retryAfterHeader) {
          const parsedSeconds = parseInt(retryAfterHeader, 10);
          if (!isNaN(parsedSeconds)) {
            waitMs = Math.max(parsedSeconds * 1000, delay);
          } else {
            const date = new Date(retryAfterHeader);
            if (!isNaN(date.getTime())) {
              waitMs = Math.max(date.getTime() - Date.now(), delay);
            }
          }
        }

        // Add 10-25% random jitter to avoid thundering herds
        const jitter = Math.floor(Math.random() * (waitMs * 0.25));
        const totalWait = waitMs + jitter;

        console.warn(`[RateLimit] HTTP 429 received for ${url}. Retrying in ${totalWait}ms (Attempt ${attempt + 1}/${maxRetries})...`);
        await new Promise((resolve) => setTimeout(resolve, totalWait));

        delay = Math.min(delay * 2, maxDelayMs);
        continue;
      }

      return response;
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }
      console.warn(`[Network] Fetch error encountered. Retrying in ${delay}ms...`, error);
      await new Promise((resolve) => setTimeout(resolve, delay));
      delay = Math.min(delay * 2, maxDelayMs);
    }
  }

  throw new Error('Rate limit exceeded. System request failed after retries.');
}
