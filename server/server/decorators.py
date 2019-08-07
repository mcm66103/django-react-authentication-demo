import jwt

from django.core.exceptions import PermissionDenied
from django.contrib.auth import authenticate

def requires_authoriaztion(function):
    def wrap(request, *args, **kwargs):
        authorization = request.headers.get('authorization')
        print(authorization)
        data = jwt.decode(authorization.split(' ')[1], 'secret', algorithms=['HS256'])
        user = authenticate(username=data['user'], password=data['password'])
        if True:
            return function(request, *args, **kwargs)
        else:
            raise PermissionDenied
    wrap.__doc__ = function.__doc__
    wrap.__name__ = function.__name__
    return wrap