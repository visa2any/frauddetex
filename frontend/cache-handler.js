const cache = new Map();

module.exports = class CacheHandler {
  constructor(options) {
    this.options = options;
    this.cache = cache;
  }

  async get(key) {
    const value = this.cache.get(key);
    if (!value) {
      return null;
    }

    const { data, timestamp } = value;
    const ttl = this.options?.ttl || 86400000; // 24 hours default

    if (Date.now() - timestamp > ttl) {
      this.cache.delete(key);
      return null;
    }

    return data;
  }

  async set(key, data, ctx) {
    if (!data || data.kind === 'FETCH') {
      return;
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });

    // Limit cache size to prevent memory issues
    if (this.cache.size > 1000) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
  }

  async revalidateTag(tag) {
    // Find and delete all entries with this tag
    for (const [key, value] of this.cache.entries()) {
      if (value.data?.tags?.includes(tag)) {
        this.cache.delete(key);
      }
    }
  }
};