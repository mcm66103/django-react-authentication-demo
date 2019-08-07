import json
import jwt

from django.http import JsonResponse
from django.contrib.auth import authenticate

from server.decorators import requires_authoriaztion

def Login(request):
    if request.method == 'POST':
        parsed_data = json.loads(request.body)
        user = authenticate(username=parsed_data['username'], password=parsed_data['password'])
        if user:
            data = {
                "user": user.username if user else None,
                "password": parsed_data['password'],
            }

            encoded_data = jwt.encode(data, 'secret', algorithm='HS256').decode('utf-8')
            return JsonResponse({"jwt": encoded_data})
        else:
            return JsonResponse({"jwt": False})

@requires_authoriaztion
def loginTest(request):
    if request.method == 'POST':
        data = {
            "Logged in": True,
        }
    return JsonResponse(data)

