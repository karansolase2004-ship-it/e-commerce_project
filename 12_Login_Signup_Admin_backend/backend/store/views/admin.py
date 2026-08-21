from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

# .. is given because it goes one folder up side and search models
from ..models import Product
from ..serializers import ProductSerializer


# get product list
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_products(request):

    products = Product.objects.filter(owner=request.user)

    serializer = ProductSerializer(products,many=True)

    return Response(serializer.data)

# Add product : 
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_product(request):

    serializer = ProductSerializer(data=request.data)

    if serializer.is_valid():

        serializer.save(owner=request.user)

        return Response(serializer.data)

    return Response(serializer.errors,status=400)

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

    serializer = ProductSerializer(
        product,
        data=request.data
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