from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes
from ..serializers import RegisterSerializer, UserSerializer
from rest_framework import status
from ..models import Product, Category, Cart, CartItem, Order, OrderItem
from ..serializers import ProductSerializer, CategorySerializer, CartSerializer, CartItemSerializer
from rest_framework.pagination import PageNumberPagination
from django.db import  transaction

class productpagination(PageNumberPagination) : 
  page_size = 4

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def current_user(request):
    return Response({
        "username": request.user.username,
        "is_staff": request.user.is_staff,
    })

@api_view(['GET'])
def get_products(request) : 
  search = request.GET.get("search", "")
  products = Product.objects.all()

  if search : 
    products = products.filter(name__icontains=search)
  paginator = productpagination()
  paginated_product = paginator.paginate_queryset(products, request)
  serializer = ProductSerializer(paginated_product, many=True)
  return paginator.get_paginated_response(serializer.data)

@api_view(['GET'])
def get_categories(request) : 
  categories = Category.objects.all()
  serializer = CategorySerializer(categories, many=True)
  return Response(serializer.data)

@api_view(['GET'])
def get_product(request, pk) : 
  try : 
    product = Product.objects.get(id=pk)
    serializer = ProductSerializer(product, context = {'request' : request})
    return Response(serializer.data)
  except Product.DoesNotExist : 
    return Response({'error' : 'Product not found'}, status=404)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_cart(request) :
  # request.user get user based on token so it avoid passing user id from frontend through url
  cart, created = Cart.objects.get_or_create(user=request.user)
  serializer = CartSerializer(cart)
  return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_cart(request) : 
  product_id = request.data.get('product_id')

  if not product_id : 
    return Response({'error':'Product ID is required'}, status=400)

  try : 
    with transaction.atomic() : 
      cart, created = Cart.objects.get_or_create(user=request.user)

      try : 
        product = Product.objects.select_for_update().get(id=product_id)
      except Product.DoesNotExist : 
        return Response({'error' : 'Product not found'}, status=404)

      if product.stock < 1 : 
        return Response({
          'error' : 'Sorry! This product us currently out of stock'
        }, status=400)

      item, created = CartItem.objects.get_or_create(
        cart=cart, 
        product = product
      )

      if not created : 
        item.quantity += 1
        item.save() 

      product.stock -= 1
      product.save()

      return Response({
        'message' : 'Product added to cart successfully!',
        'available_stock' : product.stock,
        'cart' : CartSerializer(cart).data
      })

  except Exception as e : 
    return Response({'error' : str(e)}, status=500)

  
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def remove_from_cart(request) : 
  item_id = request.data.get('item_id')
  CartItem.objects.filter(id=item_id).delete()
  return Response({'message' : 'Item removed from cart'})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_cart_quantity(request) : 
    item_id = request.data.get('item_id')
    quantity = request.data.get('quantity')

    if not item_id or quantity is None:
        return Response({
            'error': 'Item ID and quantity are required'
        }, status=400)

    try:
        quantity = int(quantity)
    except (ValueError, TypeError):
        return Response({'error': 'Invalid quantity'}, status=400)

    if quantity < 1:
        return Response({
            'error': 'Minimum quantity is 1'
        }, status=400)

    try:
        with transaction.atomic():

            cart = Cart.objects.select_for_update().get(user=request.user)

            try:
                item = CartItem.objects.get(
                    id=item_id,
                    cart=cart
                )
            except CartItem.DoesNotExist:
                return Response({'error': 'Cart item not found'}, status=404)

            product = Product.objects.select_for_update().get(
                id=item.product_id
            )

            difference = quantity - item.quantity

            if difference > 0:

                if product.stock < difference:
                    return Response({
                        'error': f'Sorry! Only {product.stock} more items are available.'
                    }, status=400)

                product.stock -= difference

            elif difference < 0:

                product.stock += abs(difference)

            product.save()

            item.quantity = quantity
            item.save()

            return Response({
                'message': 'Cart quantity updated successfully!',
                'available_stock': product.stock,
                'cart_item': CartItemSerializer(item).data
            })

    except Cart.DoesNotExist:
        return Response({'error': 'Cart not found'}, status=404)

    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def remove_from_cart(request):

    item_id = request.data.get('item_id')

    if not item_id:
        return Response({'error': 'Item ID is required'}, status=400)

    try:
        with transaction.atomic():

            cart = Cart.objects.select_for_update().get(user=request.user)

            try:
                item = CartItem.objects.get(
                    id=item_id,
                    cart=cart
                )
            except CartItem.DoesNotExist:
                return Response({'error': 'Cart item not found'}, status=404)

            product = Product.objects.select_for_update().get(
                id=item.product_id
            )

            product.stock += item.quantity
            product.save()

            item.delete()

            return Response({
                'message': 'Product removed from cart successfully!',
                'available_stock': product.stock
            })

    except Cart.DoesNotExist:
        return Response({'error': 'Cart not found'}, status=404)

    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_order(request):
    try:
        with transaction.atomic():

            data = request.data

            name = data.get('name')
            address = data.get('address')
            phone = data.get('phone')
            payment_method = data.get('payment_method', 'COD')

            if not name or not address or not phone:
                return Response({
                    'error': 'Name, address and phone are required'
                }, status=400)

            if not phone.isdigit() or len(phone) < 10:
                return Response({
                    'error': 'Invalid phone number'
                }, status=400)

            cart = Cart.objects.select_for_update().get(user=request.user)

            cart_items = list(
                cart.items.select_related('product').all()
            )

            if not cart_items:
                return Response({
                    'error': 'Cart is empty'
                }, status=400)

            total = sum(
                item.product.price * item.quantity
                for item in cart_items
            )

            order = Order.objects.create(
                user=request.user,
                name=name,
                address=address,
                phone=phone,
                payment_method=payment_method,
                total_amount=total
            )

            for item in cart_items:

                OrderItem.objects.create(
                    order=order,
                    product=item.product,
                    quantity=item.quantity,
                    price=item.product.price
                )

            cart.items.all().delete()

            return Response({
                'message': 'Order created successfully',
                'order_id': order.id
            })

    except Cart.DoesNotExist:
        return Response({'error': 'Cart not found'}, status=404)

    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['POST'])
@permission_classes([AllowAny]) 
def register_view(request) : 
  serializer = RegisterSerializer(data=request.data)
  if serializer.is_valid() : 
    user = serializer.save()
    return Response({"Message" : "User created Successfully","user": UserSerializer(user).data}, status=status.HTTP_201_CREATED)
  return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
