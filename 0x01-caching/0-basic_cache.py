#!/usr/bin/env python3

"""
define a class BasicCache that inherits from BaseCaching
"""
BaseCaching = __import__('base_caching').BaseCaching


class BasicCache(BaseCaching):
    """
    represent a caching system
    """

    def __init__(self):
        """intialize"""
        super().__init__()

    def put(self, key, item):
        """
        assign to the dictionary self.cache_data the item
        value for the key key
        """
        if key is None or item is None:
            return
        self.cache_data[key] = item

    def get(self, key):
        """
        return the value in self.cache_data linked to key
        """
        if key is None or self.cache_data.get(key) is None:
            return
        return self.cache_data[key]
