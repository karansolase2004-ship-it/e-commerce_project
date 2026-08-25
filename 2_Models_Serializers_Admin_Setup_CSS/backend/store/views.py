from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Product, Category
from .serializers import ProductSerializer, CategorySerializers

@api_view(['GET'])
def get_products(request) : 
  products = Product.objects.all()
  serializer = ProductSerializer(products, many=True)
  return Response(serializer.data)

@api_view(['GET'])
def get_categories(request) : 
  categories = Category.objects.all()
  serializer = CategorySerializers(categories, many=True)
  return Response(serializer.data)