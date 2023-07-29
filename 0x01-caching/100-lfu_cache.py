#!/usr/bin/python3

"""
define a class LFUCache that inherits from BaseCaching
"""
from collections import defaultdict
from datetime import datetime
BaseCaching = __import__('base_caching').BaseCaching


class LFUCache(BaseCaching):

    def __init__(self):
        super().__init__()
        self.frequency = defaultdict(int)
        self.access_order = {}  # {key: timestamp}

    def put(self, key, item):
        if key is None or item is None:
            return

        if key in self.cache_data:
            self.cache_data[key] = item
            self.access_order[key] = datetime.now()
            self.frequency[key] += 1
        else:
            if len(self.cache_data) >= self.MAX_ITEMS:
                min_freq = min(self.frequency.values())
                least_frequent_keys = [k for k, v in
                                       self.frequency.items() if v == min_freq]

                least_recent_key = min(least_frequent_keys,
                                       key=lambda k: self.access_order[k])
                del self.cache_data[least_recent_key]
                del self.frequency[least_recent_key]
                del self.access_order[least_recent_key]
                print(f"DISCARD: {least_recent_key}")

            self.cache_data[key] = item
            self.frequency[key] = 1
            self.access_order[key] = datetime.now()

    def get(self, key):
        if key is None or key not in self.cache_data:
            return None

        # Update access timestamp and frequency for the retrieved item
        self.access_order[key] = datetime.now()
        self.frequency[key] += 1

        return self.cache_data[key]
