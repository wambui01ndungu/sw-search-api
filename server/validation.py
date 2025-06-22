import re 
#validation.py

def validate_signup_data(data):
    if not isinstance(data, dict):
        return False, "invalid input format. Expected JSON objects"
    
    required_fields =('firstname', 'surname', 'email' ,'password')
    if not all(k in data for k in required_fields):
        return False, "missing required fields"

    firstname = data.get("firstname", "").strip()
    surname = data.get("surname","").strip()
    email = data.get("email","").strip().lower()
    password =data.get("password","").strip()

    if not email or not password:
        return False, "Email and password required"

    if not firstname or not surname:
        return False,"firstname and surname required"
    
    email_regex= r'^[^@\s]+@[^@\s]+\.[^@\s]+$'
    if not re.match(email_regex, email):
        return False, "Please enter a valid email address"

    password_regex = r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$'
    if not re.match(password_regex, password):
        return False,("Password must be atleast 8 characters , include " "an uppercase, lowercase , and a number")
  
    return True, "valid"