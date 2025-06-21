
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



#memory catche structure

CACHE_DURATION = int(os.environ.get('CACHE_DURATION_SECONDS', 900))



  #search endpionts
class SearchResource(Resource):
    @jwt_required_rotated
    def get (self):
      query= request.args.get('query',"").strip().lower()
      if not query:
          return error_response("missing query", "'query'parameter is required"),400
      current_time = datetime.utcnow()
      user_id =get_jwt_identity()
      print("JWT identity (user_id):", user_id)



      #check cache
      if query in cache:
          data,timestamp =cache[query]
          if (current_time - timestamp).total_seconds() < CACHE_DURATION:
              print("serving from in-memory cache")
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
                print("serving from database cache")
                return{
                    "source":"database",
                    "results": parsed_results
                },200
            except Exception as e:
                log_internal_error(e,"parse_db_cache")
        else:
           print("Database cache expired")
        
      else:
         print("No db cache found")

      try:
          print("fetching from SWAPI")

        #cache results
      
          results = fetch_starwars_people(query)
          sorted_results = sorted(results, key=lambda x: x['name'].lower())
        
          cache[query]=(sorted_results,current_time)

        
          existing_cache = SearchCache.query.filter_by(search_term=query, user_id= user_id).first()
          if existing_cache:
            existing_cache.results = (sorted_results)
            existing_cache.timestamp = datetime.utcnow()
          else:
              new_cache_entry =SearchCache(
                search_term=query,
                results=(sorted_results),
                user_id=user_id,
                timestamp=datetime.utcnow()
              )
              db.session.add(new_cache_entry)
          db.session.commit()
       
          print(f"Cache saved for term '{query}' by user {user_id} at {datetime.utcnow()}")

        

          return ({
            "source":"swapi",    
            "results":sorted_results
           }),200
      
      except requests.RequestException as e:
          log_internal_error(e,"fetch_starwars_people")
          return error_response("swapi_error", "failed to fetch data from Starwrs API"),500

             


search_bp = Blueprint("search", __name__)
search_bp.add_url_rule('/', view_func=SearchResource.as_view("search"))