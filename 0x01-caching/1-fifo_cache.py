#!/usr/bin/env python3
"""
define a class FIFOCache that inherits from BashCaching
"""
BaseCaching = __import__('base_caching').BaseCaching


class FIFOCache(BaseCaching):
    """
    represent a caching system
    """
    def __init__(self):
        """intialize"""
        super().__init__()
        self.order = []

    def put(self, key, item):
        """ assign to the dictionary self.cache_data the item
        value for the key key
        """
        if key is None or item is None:
            return

        if key in self.order:
            self.cache_data[key] = item
        else:
            if len(self.order) >= BaseCaching.MAX_ITEMS:
                key_value = self.order.pop(0)
                del self.cache_data[key_value]
                print("DISCARD: {}".format(key_value))

            self.cache_data[key] = item
            self.order.append(key)

    def get(self, key):
        """eturn the value in self.cache_data linked to key
        """
        if key is None or self.cache_data.get(key) is None:
            return None
        return self.cache_data[key]
