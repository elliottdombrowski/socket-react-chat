const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const PORT = process.env.PORT || 4000;

io.on('connection', socket => {
    socket.on('message', ({ name, message }) => {
        io.emit('message', { name, message });
    });
});

http.listen(PORT, function() {
    console.log(`listening on port ${PORT}`);
})