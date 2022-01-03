from random_address import real_random_address
import requests
import names
MAX_ACCOUNTS = 90
URL_DEV = "http://localhost:5555/signup"
URL_PROD = 'https://agripage.herokuapp.com/signup'

def generate_address():
    raw_address = real_random_address()
    address = ""
    for key, value in raw_address.items():
        try:
            if key != 'coordinates':
                address += f"{value} "
        except Exception as e:
            print(e)
            continue
    return {'address':address, 'state': raw_address['state']}
    

for signup_request in range(0,MAX_ACCOUNTS):
    user_name = names.get_first_name()
    user_lastname = names.get_last_name()
    random_address = generate_address()
    payload = {
        "username": user_name,
        "userType":"farmer",
        "email": user_name+"."+user_lastname +"@agripage.com",
        "password":"toto123",
        "passwordConfirmation":"toto123",
        "businessName":user_lastname+" business",
        "businessAddress": random_address['address'],
        "businessDescription": "bla bla bla",
        "region": random_address['state']
    }
    response = requests.post(URL_PROD, data=payload)
    if response.status_code != 200:
        print(response.content)
    print(response.status_code)
