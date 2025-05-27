# sw-search-api

## overview
SW-search Api is a program that allows a user to sign up, log in and search for Star Wars characters. it uses the SWAPI API  and  implements JWT- based authentication with frontend autosuggestions to enhance user experience.


The project is devided into two main components:


## Frontend features  

##### signup section- allow users creat accounts
##### login section - authenticate  users and stire JWT
##### Search button - [rotected route with live seach and auto-complete suggestions]

## Frontend features

##### JWT authentication
##### SWAPI integration with caching
##### Protected routes for search
##### PostgreSQL database for storing user credentials


## Tech Stack
### **Backend**
-**langeage:**python
- **Framework:** Flask
- **Database:** PostgreSQL
- **Authentication:** Flask-JWT-Extended
- **API Design:** Flask-RESTful
- **Migrations:** Flask-Migrate
-**Cors:** Enabled via flask-cors

### **Frontend**
-**language:**javaScript
- **Framework:** React
- **features:** -
*Signup/login functionality*
*JWT stored in local storage*
*livesearch and auto complete with suggestion*

##Setup.&.Installation
### **prerequisites**
ensure you have the following installed
-python 3.8+
-postgresSQL
-node.js and npm (for the frontend)

###**Frontend setup**
1. clone the repository and navigate  to the front end folder

 git clone https://github.com/wambui01ndungu/sw-search-api


cd client


 2. Insatll dependancies by running 
 npm install
l


 3. start by running
 npm start

 4. set up enviroment variables
 pip install -r requirements

 5. Run the server.,
 flask run --port=3006


###**Backend setup**
1. Navigate  to the backend folder

cd server

 2. create a virtual environment and activate it :

 pipenv shell


 3. install dependancies

 4. set up enviroment variables
 pip install -r requirements

 5. Run the server.,
 flask run --port=3006
  
## API Endpoints


POST /signup: Register a new user

POST /login: Log in with email and password

GET /search?query=obi: Protected search endpoint using JWT

GET /search: Fetch all cached search results (protected)


Conclution
 The  project demonstrate a full-stack implementation of authenticatio, API integratio, and react frondent interaction using fLASK AND PostgressSQL. Protected with 

