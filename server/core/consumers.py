from asgiref.sync import async_to_sync
from channels.generic.websocket import JsonWebsocketConsumer
from core.models import Program


class BaseConsumer(JsonWebsocketConsumer):
    """Wrapper for the default websocket consumer cause it's confusing."""

    def group_add(self, group, channel):
        async_to_sync(self.channel_layer.group_add)(group, channel)

    def group_discard(self, group, channel):
        async_to_sync(self.channel_layer.group_discard)(group, channel)

    def group_send(self, group, obj):
        async_to_sync(self.channel_layer.group_send)(group, obj)


class AdminConsumer(BaseConsumer):
    def connect(self):
        program_name = self.scope["url_route"]["kwargs"]["program_name"]
        program_edition = self.scope["url_route"]["kwargs"]["program_edition"]

        program = Program.objects.get(
            name=program_name, edition=program_edition
        )  # TODO this probably has to be person-specific
        self.program = "P" + str(program.id)

        self.group_add(self.program, self.channel_name)
        self.accept()

    def receive_json(self, content):  # receive from the frontend
        message = content["message"]
        print(message)
        self.send_update()

    def disconnect(self, close_code):
        self.group_discard(self.program, self.channel_name)

    def send_update(self):
        # TODO send actual update in scheduling information
        self.group_send(self.program, {"message": "update", "type": "update"})

    def update(self, event):
        self.send_json({"message": "HI THIS IS A TEST"})
