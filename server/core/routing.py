from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from core.consumers import AdminConsumer
from django.urls import path

websocket_urlpatterns = [
    path("ws/<program_name>/<program_edition>/scheduler", AdminConsumer),
]

application = ProtocolTypeRouter(
    {"websocket": AuthMiddlewareStack(URLRouter(websocket_urlpatterns)),}
)
