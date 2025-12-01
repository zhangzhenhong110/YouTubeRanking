class RateLimiter {
  private queue: number[] = [];
  private maxRequestsPerSecond: number;

  constructor(maxRequestsPerSecond: number = 5) {
    this.maxRequestsPerSecond = maxRequestsPerSecond;
  }

  async throttle(): Promise<void> {
    const now = Date.now();
    
    // Remove requests older than 1 second
    this.queue = this.queue.filter(timestamp => now - timestamp < 1000);

    // If we've hit the limit, wait
    if (this.queue.length >= this.maxRequestsPerSecond) {
      const oldestRequest = this.queue[0];
      const waitTime = 1000 - (now - oldestRequest) + 10; // Add 10ms buffer
      await new Promise(resolve => setTimeout(resolve, waitTime));
      return this.throttle(); // Recursive call after waiting
    }

    // Add current request to queue
    this.queue.push(now);
  }
}

export const rateLimiter = new RateLimiter(5);






