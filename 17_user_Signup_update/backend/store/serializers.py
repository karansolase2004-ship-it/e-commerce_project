from rest_framework import serializers
from .models import Product, Category, Cart, CartItem
from django.contrib.auth.models import User
import re
from django.contrib.auth.models import User

class CategorySerializer(serializers.ModelSerializer) : 
  class Meta : 
    model = Category 
    fields = '__all__'

class ProductSerializer(serializers.ModelSerializer) : 
  category = CategorySerializer(read_only=True)

  class Meta : 
    model = Product
    fields = '__all__'

class ProductCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = "__all__"
        read_only_fields = ["owner"]

class CartItemSerializer(serializers.ModelSerializer) : 
  product_name = serializers.CharField(source='product.name',read_only=True)
  product_price = serializers.DecimalField(source='product.price', max_digits=10, decimal_places=2, read_only=True)
  product_image = serializers.ImageField(source='product.image', read_only=True)

  class Meta : 
    model = CartItem
    fields = '__all__'

class CartSerializer(serializers.ModelSerializer) :
  items = CartItemSerializer(many=True, read_only=True)
  total = serializers.ReadOnlyField()

  class Meta : 
      model = Cart
      fields = '__all__'

class UserSerializer(serializers.ModelSerializer): 
  class Meta : 
    model = User 
    fields = ['id', 'username', 'email']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2']

    def validate_username(self, value):
        if User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError(
                "Username already exists. Please choose a different username."
            )

        if len(value) < 3:
            raise serializers.ValidationError(
                "Username must be at least 3 characters long."
            )

        return value

    def validate_email(self, value):
        if value and User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError(
                "Email is already registered."
            )

        return value

    def validate(self, data):
        password = data['password']
        password2 = data['password2']

        if password != password2:
            raise serializers.ValidationError({
                "password2": "Passwords do not match."
            })

        if len(password) < 8:
            raise serializers.ValidationError({
                "password": "Password must be at least 8 characters long."
            })

        if not re.search(r'[A-Z]', password):
            raise serializers.ValidationError({
                "password": "Password must contain at least one uppercase letter."
            })

        if not re.search(r'[a-z]', password):
            raise serializers.ValidationError({
                "password": "Password must contain at least one lowercase letter."
            })

        if not re.search(r'[0-9]', password):
            raise serializers.ValidationError({
                "password": "Password must contain at least one number."
            })

        if not re.search(r'[^A-Za-z0-9]', password):
            raise serializers.ValidationError({
                "password": "Password must contain at least one special character."
            })

        return data

    def create(self, validated_data):
        validated_data.pop('password2')

        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )

        return user

class AdminRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2']

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError("Passwords do not match")

        return data

    def create(self, validated_data):
        username = validated_data['username']
        email = validated_data.get('email', '')
        password = validated_data['password']

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password
        )

        user.is_staff = True
        user.save()

        return user
