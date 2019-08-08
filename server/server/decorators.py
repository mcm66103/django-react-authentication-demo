import jwt

from django.http import HttpResponseForbidden
from django.contrib.auth import authenticate

def requires_authoriaztion(function):
    def wrap(request, *args, **kwargs):
        authorization = request.headers.get('authorization')

        user = decodeJwtAndReturnUser(authorization)
        if user:
            return function(request, *args, **kwargs)

        else:
            return HttpResponseForbidden()

    wrap.__doc__ = function.__doc__
    wrap.__name__ = function.__name__
    return wrap


def decodeJwtAndReturnUser(authorization_header):
    try:
        data = jwt.decode(authorization_header.split(' ')[1], 'secret', algorithms=['HS256'])
        user = authenticate(username=data['user'], password=data['password'])
        return user

    except Exception as e:
        print(e)
        return None