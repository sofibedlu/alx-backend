#!/usr/bin/env python3
"""
define a function called index_range
"""
import csv
import math
from typing import List, Tuple, Dict


def index_range(page: int, page_size: int) -> Tuple[int, int]:
    """return a tuple of size two containing a start
    index and an end index
    """

    start_index = (page - 1) * page_size
    end_index = start_index + page_size

    return (start_index, end_index)


class Server:
    """Server class to paginate a database of popular baby names.
    """
    DATA_FILE = "Popular_Baby_Names.csv"

    def __init__(self):
        self.__dataset = None

    def dataset(self) -> List[List]:
        """Cached dataset
        """
        if self.__dataset is None:
            with open(self.DATA_FILE) as f:
                reader = csv.reader(f)
                dataset = [row for row in reader]
            self.__dataset = dataset[1:]

        return self.__dataset

    def get_page(self, page: int = 1, page_size: int = 10) -> List[List]:
        """
        Return the appropriate page of the dataset
        """
        assert isinstance(page, int) and page > 0
        assert isinstance(page_size, int) and page_size > 0

        start_index, end_index = index_range(page, page_size)
        dataset = self.dataset()

        # Check if the indexes are out of range
        if start_index >= len(dataset) or end_index < 0:
            return []

        # Clip the end_index to the maximum index available
        end_index = min(end_index, len(dataset) - 1)

        return dataset[start_index: end_index]

    def get_hyper(self, page: int = 1, page_size: int = 10) -> Dict:
        """
        -return a dictionary ccontaning
        -provide clients with information about the structure of the
        paginated data
        """
        total_pages = math.ceil(len(self.dataset()) / page_size)
        next_page = page + 1 if page + 1 <= total_pages else None
        prev_page = page - 1 if page - 1 > 0 else None
        metadata = {
                "page_size": len(self.get_page(page, page_size)),
                "page": page,
                "data": self.get_page(page, page_size),
                "next_page": next_page,
                "prev_page": prev_page,
                "total_pages": total_pages
                }

        return metadata
