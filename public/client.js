const socket = io()

// Alla consts för att kunna lägga in allt som händer HTML
const formUser = document.querySelector('#formUser')
const inputUser = document.querySelector('#inputUser')
const messages = document.querySelector('#messages')
const formMessage = document.querySelector('#formMessage')
const inputMessage = document.querySelector('#inputMessage')
const userContianer = document.querySelector('#userContainer')
const throws = document.querySelector('#throws')
const form2 = document.querySelector('#form2')

let myUser

formUser.addEventListener('submit', function (e) {
	//Event listener som gör att användaren kan mata in sitt namn, och lägger namnet
	// i myUser.
	e.preventDefault()
	myUser = inputUser.value
	userContianer.innerHTML =
		'<h2>Välkommen ' +
		myUser +
		', du kan skicka meddelande till din motståndare i rutan nedan</h2>'
	document.getElementById('user').style.display = 'none'
	document.getElementById('message').style.display = 'block'
})

formMessage.addEventListener('submit', function (e) {
	e.preventDefault() // Förhindrar sidan från att laddas on när detta event sker.
	// Själva eventet som skickar och renderar meddelandet, en emit sker och skickar allt till server-side
	// där det sedan läggs i msg.
	if (inputMessage.value) {
		socket.emit('chatMessage', { user: myUser, message: inputMessage.value })
		inputMessage.value = ''
	}
})

socket.on('newChatMessage', function (msg) {
	// Efter eventet ovan så kommer msg tillbaka hit och renderar det som skickades med.
	let item = document.createElement('li')
	item.textContent = msg
	messages.appendChild(item)
})

// Här börjar koden för tärningsspelet, de två variablerna under behövs för att
// samla data som ska renderas ut för varje kast.
let kast = 0
let diceSum = 0
form2.addEventListener('submit', function (e) {
	// När man klickar på "Kasta" så körs detta event, randDice innehåller ett
	// slumpmässigt tal mellan 1 och 6.
	let randDice = Math.floor(Math.random() * 6 + 1)
	//Nedan samlas totalt antal kast och totala summan av alla kast.
	diceSum += randDice
	kast++

	e.preventDefault()
	//Sedan emitas ett objekt med allt som behövs för att rendera korrekt data.
	socket.emit('diceThrow', {
		user: myUser,
		antal: kast,
		dice: randDice,
		sum: diceSum
	})
})

socket.on('newDiceThrow', function (thr) {
	//Här kommer allt tillbaka från kastet och renderas.
	let item = document.createElement('li')
	item.textContent = thr
	throws.appendChild(item)
})
