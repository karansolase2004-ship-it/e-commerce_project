from rest_framework.permissions import IsAuthenticated,  AllowAny
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from ..models import Product
from ..serializers import ProductSerializer,ProductCreateUpdateSerializer
# get product list
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_products(request):

    products = Product.objects.filter(owner=request.user).order_by("created_at")

    serializer = ProductSerializer(products,many=True)

    return Response(serializer.data)

# Add product : 
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_product(request):

    serializer = ProductCreateUpdateSerializer(data=request.data)

    if serializer.is_valid():

        serializer.save(owner=request.user)

        return Response(serializer.data)

    return Response(serializer.errors,status=400)

""" @api_view(["POST"])
@permission_classes([AllowAny])
def add_product(request):
    print("Reached add_product")
    print("User:", request.user)

    return Response({
        "message": "Reached add_product"
    }) """

""" @api_view(["POST"])
@permission_classes([AllowAny])
def add_product(request):
    print("User:", request.user)
    print("Authenticated:", request.user.is_authenticated)
    print("Authorization:", request.headers.get("Authorization"))

    return Response({
        "user": str(request.user),
        "authenticated": request.user.is_authenticated,
        "authorization": request.headers.get("Authorization"),
    }) """

# update product : 
@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_product(request,id):

    try:
        product = Product.objects.get(
            id=id,
            owner=request.user
        )

    except Product.DoesNotExist:
        return Response(status=404)

    serializer = ProductCreateUpdateSerializer(
        product,
        data=request.data,
        # due to below serializer updates only those field that are present in request and leaves rest of things unchanged .
        partial=True
    )

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)

    return Response(serializer.errors,status=400)

# Delete product : 
@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_product(request,id):

    try:
        product = Product.objects.get(
            id=id,
            owner=request.user
        )

    except Product.DoesNotExist:
        return Response(status=404)

    product.delete()

    return Response({
        "message":"Deleted Successfully"
    })