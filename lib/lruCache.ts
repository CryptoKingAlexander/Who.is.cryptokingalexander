export class LRUCache<K, V> {
  private capacity: number;
  private map = new Map<K, V>();
  private hits = 0;
  private misses = 0;

  constructor(capacity: number) {
    this.capacity = capacity;
  }

  get(key: K): V | undefined {
    if (!this.map.has(key)) {
      this.misses++;
      return undefined;
    }
    const val = this.map.get(key)!;
    this.map.delete(key);
    this.map.set(key, val);
    this.hits++;
    return val;
  }

  set(key: K, value: V): void {
    if (this.map.has(key)) {
      this.map.delete(key);
    } else if (this.map.size >= this.capacity) {
      const firstKey = this.map.keys().next().value;
      if (firstKey !== undefined) {
        this.map.delete(firstKey);
      }
    }
    this.map.set(key, value);
  }

  has(key: K): boolean {
    return this.map.has(key);
  }

  getStats() {
    const total = this.hits + this.misses;
    return {
      size: this.map.size,
      capacity: this.capacity,
      hits: this.hits,
      misses: this.misses,
      hitRatePercent: total > 0 ? Math.round((this.hits / total) * 100) : 0,
    };
  }
}
