from django.contrib import admin
from .models import Category, Product, UserProfile, Order, OrderItem

# Register your models here.

admin.site.register(Category)
admin.site.register(Product)
admin.site.register(UserProfile)

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "name",
        "phone",
        "address",
        "payment_method",
        "total_amount",
        "created_at",
        )
    readonly_fields = ("created_at",)

admin.site.register(OrderItem)