#cache.py
import json
from models import SearchCache
from utils import log_internal_error

cache ={}

def load_cache_from_db():
    global cache
    cache.clear()
    all_cache_entries = SearchCache.query.all()
    for entry in all_cache_entries:
        
        try:
            results = json.loads(entry.results)

            cache[entry.search_term] = (results, entry.timestamp)
        except Exception as e:
            log_internal_error(e, f" cache-load:{entry.search_term}")