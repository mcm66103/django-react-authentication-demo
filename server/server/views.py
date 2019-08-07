import json
import jwt

from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout

def Login(request):
    if request.method == 'POST':
        parsed_data = json.loads(request.body)
        user = authenticate(username=parsed_data['username'], password=parsed_data['password'])
        data = {
            "user": user.username if user else None,
            "logged_in": request.user.is_authenticated,
        }

        encoded_data = jwt.encode(data, 'secret', algorithm='HS256').decode('utf-8')

        return JsonResponse({"jwt": encoded_data})

