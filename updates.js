async function getUpdates () {
	let message = JSON.parse(window.localStorage.getItem('message')) || []
	let response = await fetch(`https://api.telegram.org/bot${TOKEN}/getUpdates?offset=` + message?.update_id)
	let { result } = await response.json()
	let newMessage = result.at(-1)
	
	if(message && message.update_id < result.at(-1)?.update_id) {
		window.localStorage.setItem('message', JSON.stringify(newMessage))
		return newMessage
	} else if (!message) {
		window.localStorage.setItem('message', JSON.stringify(newMessage))
		return newMessage
	}
}

async function getUsers() {
	let message = JSON.parse(window.localStorage.getItem('message')) || []
	let response = await fetch(`https://api.telegram.org/bot${TOKEN}/getUpdates?offset=` + message?.update_id)
	let { result } = await response.json()
	
	let users = JSON.parse(window.localStorage.getItem('users')) || []
	if (!JSON.stringify(users).includes(result[0].message?.chat.id)) {
		users.push({id: result[0].message.chat.id, like:[], notLike:[]})
	}
	window.localStorage.setItem('users', JSON.stringify(users))
}



