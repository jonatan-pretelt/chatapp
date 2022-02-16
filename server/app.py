import socketio

sio = socketio.Server(cors_allowed_origins='*')
app = socketio.WSGIApp(sio, static_files={
    '/':'../public/build/'
})

@sio.event
def connect(sid,environ):
    print(sid, "connected")

@sio.event
def disconnect(sid):
    print(sid, "disconnected")


@sio.event
def message(sid, data):
    print(sid, data)
    sio.emit('message', {'name': data['name'], 'message': data['message']})