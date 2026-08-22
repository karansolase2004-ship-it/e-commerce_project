from django.urls import path 
from .views import public 
from .views import admin 
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

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
  path('register/', public.register_view),

  path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
  path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

  path("admin/products/",admin.my_products),
  path("admin/products/add/",admin.add_product),
  path("admin/products/<int:id>/",admin.update_product),
  path("admin/products/<int:id>/delete/",admin.delete_product),
]