from django.urls import path 
from .views import public 
from .views import admin 
from .views.public import CookieTokenObtainPairView, LogoutView, CookieTokenRefreshView
from store.views.public import get_csrf_token

urlpatterns = [
  path('products/',public.get_products),
  path('categories/', public.get_categories),
  path('products/<int:pk>/', public.get_product),
  path('cart/', public.get_cart),

  path('cart/add/', public.add_to_cart),
  path('cart/remove/', public.remove_from_cart),
  path('cart/update/', public.update_cart_quantity),

  path('order/create/', public.create_order),
  path("me/", public.current_user),
  # normal register
  path('register/', public.register_view),

  path('token/', CookieTokenObtainPairView.as_view()),
  path('token/refresh/', CookieTokenRefreshView.as_view()),
  path('logout/', LogoutView.as_view()),

  path('csrf/', get_csrf_token, name='csrf'),

  path("admin/products/",admin.my_products),
  path("admin/products/add/",admin.add_product),
  path("admin/products/<int:id>/",admin.update_product),
  path("admin/products/<int:id>/delete/",admin.delete_product),
  path("admin/products/<int:id>/stock/", admin.update_product_stock),
]