// src/config.js
const BASE_URL = process.env.NODE_ENV === 'production'
  ?" https://sw-search-api.onrender.com"
  : "http://localhost:3006";

export default BASE_URL;
