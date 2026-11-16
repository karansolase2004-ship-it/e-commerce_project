
from ..permissions import IsAdminUser
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from ..models import Product
from django.db.models import F
from ..serializers import ProductSerializer,ProductCreateUpdateSerializer
# get product list
@api_view(["GET"])
@permission_classes([IsAdminUser])
def my_products(request):

    products = Product.objects.filter(owner=request.user).order_by("created_at")

    serializer = ProductSerializer(products,many=True)

    return Response(serializer.data)

# Add product : 
@api_view(["POST"])
@permission_classes([IsAdminUser])
def add_product(request):

    serializer = ProductCreateUpdateSerializer(data=request.data)

    if serializer.is_valid():

        serializer.save(owner=request.user)

        return Response(serializer.data)

    return Response(serializer.errors,status=400)

# update product : 
@api_view(["PUT"])
@permission_classes([IsAdminUser])
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
        partial=True
    )

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)

    return Response(serializer.errors,status=400)

# Delete product : 
@api_view(["DELETE"])
@permission_classes([IsAdminUser])
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

# Update product stock
@api_view(["POST"])
@permission_classes([IsAdminUser])
def update_product_stock(request, id):

    action = request.data.get("action")

    try:
        product = Product.objects.get(
            id=id,
            owner=request.user
        )
    except Product.DoesNotExist:
        return Response({"message": "Product not found"}, status=404)

    if action == "increase":
        Product.objects.filter(id=id, owner=request.user).update(
            stock=F('stock') + 1
        )

    elif action == "decrease":
        updated = Product.objects.filter(
            id=id,
            owner=request.user,
            stock__gt=0
        ).update(stock=F('stock') - 1)

        if updated == 0:
            return Response(
                {"message": "Stock cannot be less than 0"},
                status=400
            )

    elif action == "set":
        quantity = request.data.get("quantity")

        if isinstance(quantity, bool) or not str(quantity).isdigit():
            return Response(
                {"message": "Enter a valid whole number"},
                status=400
            )

        quantity = int(quantity)

        Product.objects.filter(id=id, owner=request.user).update(
            stock=quantity
        )

    else:
        return Response({"message": "Invalid action"}, status=400)

    product.refresh_from_db()

    return Response({
        "message": "Stock updated successfully",
        "stock": product.stock
    })