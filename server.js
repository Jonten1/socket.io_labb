const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const io = require('socket.io')(server)
const port = 3000

app.use(express.static('public'))

io.on('connection', (socket) => {
	console.log(`A client with id ${socket.id} connected to the chat!`)

	socket.on('diceThrow', (thr) => {
		// När ett kast sker skickar denna funktion tillbaka 'newDiceThrow' till client
		io.emit(
			'newDiceThrow',
			thr.user +
				' : ' +
				'Kast nr: ' +
				thr.antal +
				' Du kastade: ' +
				thr.dice +
				' Du har totalt kastat: ' +
				thr.sum
		)
	})

	socket.on('chatMessage', (msg) => {
		// När ett meddelande har skickats skickas 'newChatMessage' till client
		console.log('Meddelande: ' + msg.user + ' ' + msg.message)
		io.emit('newChatMessage', msg.user + ' : ' + msg.message)
	})

	socket.on('disconnect', () => {
		console.log(`Client ${socket.id} disconnected!`)
	})
})

server.listen(port, () => {
	console.log(`Socket.IO server running at http://localhost:${port}/`)
})
