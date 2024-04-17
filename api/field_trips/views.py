from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from django.http import JsonResponse, HttpResponse
from .models import Profile, Registration, Trip, Mushroom
from .serializers import UserSerializer, ProfileSerializer, MushroomSerializer
from rest_framework import status, generics
from rest_framework.pagination import PageNumberPagination
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User, Group
from django.shortcuts import get_object_or_404
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny

def welcome(request):
  return HttpResponse("Welcome to the OMS Field Trip API")

# User can login, signup, logout
@api_view(['POST'])
def login(request):
  user = get_object_or_404(User, username=request.data['username'])
  if not user.check_password(request.data['password']):
    return Response({"detail": "Not Found."}, status=status.HTTP_404_NOT_FOUND)
  token, created = Token.objects.get_or_create(user=user)
  serializer = UserSerializer(instance=user)
  return Response({"token": token.key, "user": serializer.data})

@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
  serializer = UserSerializer(data=request.data)
  if serializer.is_valid():
    user = serializer.save()
    #hash pw. so og not stored
    user.set_password(request.data['password'])
    #add user to member group
    group, created = Group.objects.get_or_create(name='Member')
    user.groups.add(group)
    user.save()
    #add profile to user
    Profile.objects.create(user=user)
    token = Token.objects.create(user=user)
    return Response({"token": token.key, "user": serializer.data}, status=status.HTTP_201_CREATED)
  return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def test_token(request):
  return Response("passed for {}".format(request.user.email))

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
def logout(request):
  #deletes token
  request.user.auth_token.delete()
  return Response("logged out: {}".format(request.user.email), status=status.HTTP_200_OK)

# User can add details to their profile
@api_view(['GET', 'PUT'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def profile(request):
  profile = Profile.objects.get(user=request.user)
  if request.method == 'GET':
    serializer = ProfileSerializer(profile)
    return Response(serializer.data)
  elif request.method == 'PUT':
    serializer = ProfileSerializer(profile, data=request.data, partial=True)
    if serializer.is_valid():
      serializer.save()
      return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
  
@api_view(['GET', 'POST'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
def mushroom_list(request, format=None):
  if request.method == 'GET':
    mushrooms = Mushroom.objects.all()
    paginator = PageNumberPagination()
    paginator.page_size = 20
    paginated_mushrooms = paginator.paginate_queryset(mushrooms, request)
    serializer = MushroomSerializer(paginated_mushrooms, many=True)
    return paginator.get_paginated_response(serializer.data)
  if request.method == 'POST':
    serializer = MushroomSerializer(data=request.data)
    if serializer.is_valid():
      serializer.save()
      return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
  
# dumplings/1
# @api_view(['GET', 'PUT', 'DELETE'])  
# def dumpling_detail(request, id,):
#   #make sure valid request
#   try: 
#     dumpling = Dumpling.objects.get(pk=id)
#   except Dumpling.DoesNotExist:
#     return Response(status=status.HTTP_404_NOT_FOUND)

#   if request.method == 'GET':
#     serializer = DumplingSerializer(dumpling)
#     return Response(serializer.data)
#   # check logged in user is owner
#   elif request.method in ['PUT', 'DELETE']:
#     print('Dumpling owner:', dumpling.owner)
#     print('Request user:', request.user)
   
#     if dumpling.owner != request.user:
#       return Response({'message': 'You do not have permission to edit or delete this dumpling.'}, status=status.HTTP_403_FORBIDDEN)
#     if request.method == 'PUT':
#       serializer = DumplingSerializer(dumpling, data=request.data)
#       if serializer.is_valid():
#         serializer.save()
#         return Response(serializer.data)
#       return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#     elif request.method == 'DELETE':
#       dumpling.delete()
#       return Response(status=status.HTTP_204_NO_CONTENT)
