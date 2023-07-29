#!/usr/bin/python3
"""
Test
"""
import sys

try:
    LRUCache = __import__('3-lru_cache').LRUCache

    my_cache = LRUCache()
    my_cache.print_cache()
    my_cache.put("test1", "myValue")
    my_cache.print_cache()
    test1_value = my_cache.get("test1")
    if test1_value != "myValue":
        print("get must return 'myValue', as we put it in the cache")
    else:
        print("OK")
except:
    print(sys.exc_info()[1])
