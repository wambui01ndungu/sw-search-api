
#search.py
from flask import request, jsonify, Blueprint
from flask_restful import Resource
from flask_jwt_extended import get_jwt_identity
from datetime import datetime
import requests
from models import SearchCache, db
from utils import jwt_required_rotated
from cache import cache
import os
from service import fetch_starwars_people
from utils import error_response, log_internal_error
import logging

logger = logging.getLogger(__name__)

#memory catche structure

CACHE_DURATION = int(os.environ.get('CACHE_DURATION_SECONDS', 900))



  #search endpionts
class SearchResource(Resource):
    @jwt_required_rotated
    def get (self):
      query= request.args.get('query',"").strip().lower()
      if not query:
          logger.warning("[Search] Missing 'query' parameter in request")
          return error_response("missing query", "'query'parameter is required")
      current_time = datetime.utcnow()
      user_id =get_jwt_identity()
      logger.info(f"[Search] Request received for query: '{query}' by user {user_id}")




      #check cache
      if query in cache:
          data,timestamp =cache[query]
          if (current_time - timestamp).total_seconds() < CACHE_DURATION:
              logger.info(f"[Search] Serving result from memory cache for query: '{query}'")
              return{
                "source":"cache",
                "results":data
               },200
          else:
              #expired
              del  cache[query]
      

      db_cache =SearchCache.query.filter_by(search_term=query, user_id=user_id).first()
      if db_cache:
        age = (datetime.utcnow() - db_cache.timestamp).total_seconds()
        if age < CACHE_DURATION:
            try:
                parsed_results = db_cache.results
                cache[query]=(parsed_results, db_cache.timestamp)
                logger.info(f"[Search] Serving result from DB cache for query: '{query}'")
              
                return{
                    "source":"database",
                    "results": parsed_results
                },200
            except Exception as e:
                logger.error(f"[Search] Failed to parse DB cache for query: '{query}'")
                log_internal_error(e,"parse_db_cache")
        else:
            logger.info(f"[Search] DB cache expired for query: '{query}'")
         
        
      else:
          logger.info(f"[Search] No DB cache found for query: '{query}'")
      
      try:
          logger.info(f"[Search] Fetching from SWAPI for query: '{query}'")
          
        

        #cache results
      
          results = fetch_starwars_people(query)
          sorted_results = sorted(results, key=lambda x: x['name'].lower())

          print("RESULT TYPE:", type(sorted_results))
          print("RESULT CONTENT:", sorted_results)

        
          cache[query]=(sorted_results,current_time)
          logger.info(f"[Search] Stored result in memory cache for query: '{query}'")

        
          existing_cache = SearchCache.query.filter_by(search_term=query, user_id= user_id).first()
          if existing_cache:
            existing_cache.results = (sorted_results)
            existing_cache.timestamp = datetime.utcnow()
            logger.info(f"[Search] Updated DB cache for query: '{query}' by user {user_id}")
          else:
              new_cache_entry =SearchCache(
                search_term=query,
                results=(sorted_results),
                user_id=user_id,
                timestamp=datetime.utcnow()
              )
              db.session.add(new_cache_entry)
          db.session.commit()
       
          logger.info(f"Cache saved for term '{query}' by user {user_id} at {datetime.utcnow()}")

        

          return ({
            "source":"swapi",    
            "results":sorted_results
           }),200
           
      
      except requests.RequestException as e:
          logger.error(f"[Search] Failed to fetch from SWAPI for query: '{query}'")
          log_internal_error(e,"fetch_starwars_people")
          return error_response("swapi_error", "failed to fetch data from Starwrs API")

             


search_bp = Blueprint("search", __name__)
search_bp.add_url_rule('/', view_func=SearchResource.as_view("search"))