class Bot {
	constructor(TOKEN) {
		this.photoURL = `https://pixabay.com/api/?key=25570361-2831118e9efb3556d0258fa4f&q=`
		this.TOKEN = TOKEN;
		this.URL = `https://api.telegram.org/bot${TOKEN}/`
		this.messageTypes = {}
	}

	start () {
		setInterval(async () => {
			let newMessage = await getUpdates()
			if(newMessage) {
				if (newMessage.message) {
					if(newMessage.message.text) {
						getUsers()
						return this.messageTypes['text'](newMessage.message)
					} else {
						this.sendMessage(newMessage.message.chat.id, 'Deeng')
					}
				}
				if (newMessage.callback_query) {
					this.likeOrNotlike(newMessage.callback_query)
				}
			}
		}, 500)
	}

	likeOrNotlike (callback) {
		let users = JSON.parse(window.localStorage.getItem('users'))
		for (let user of users) {
			if (user.id == callback.from.id) {
				if (!user[callback['data']].includes(callback.message.message_id)) {
					user[callback['data']].push(callback.message.message_id)
					this.sendMessage(callback.from.id, 'image saved successfully')
				} else {
					this.sendMessage(callback.from.id, 'buni tanlab bolgansiz iltimos botni qiynamang tomi ketb qosa yomon boladi lekn')
					
				}
			break
			}
		}
		window.localStorage.setItem('users', JSON.stringify(users))
		return 
	}

	on(message, callback) {
		this.messageTypes[message] = callback
	}

	async sendMessage (chatId, text, params) {
		let response = await fetch(this.URL + 'sendMessage', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				chat_id: chatId,
				text,
				...params
			})
		})
		return response
	}

	async sendPhoto (chatId, photoName, params) {
		let random = 0
		let response = await fetch(this.photoURL + photoName + '&image_type=photo')
		response = await response.json()
		if (!response.hits.length) return this.sendMessage(chatId, 'bunaqa rasmmi google dan qidiras bu bot')
		if (response.hits.length > 1) random = Math.round(Math.random() * response.hits.length)
		
		let res = await fetch(this.URL + 'sendPhoto', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				chat_id: chatId,
				photo: response.hits[random].largeImageURL,
				...params
			})
		})
		return res
	}

	reklama () {
		if(!sms.value) return
		let users = JSON.parse(window.localStorage.getItem('users')) || []
		for (let user of users) {
			this.sendMessage(user.id, sms.value)
		}
		sms.value = null
	}

	async likeImages (userId) {
		let users = JSON.parse(window.localStorage.getItem('users'))

		for (let user of users) {
			if (user.id == userId) {
				for (let like of user.like) {
					await this.forwardMessage(user.id, like)
				}
			}
		}
	}

	async notLikeImages (userId) {
		let users = JSON.parse(window.localStorage.getItem('users'))
		for (let user of users) {
			if (user.id == userId) {
				for (let not of user.notLike) {
					await this.forwardMessage(user.id, not)
				}
			}
		}
	}

	async forwardMessage (chatId, message_id, params){
		let response = await fetch(this.URL + 'forwardMessage', {
		  method: 'POST',
		  headers: {
			'Content-Type': 'application/json'
		  },
		  body: JSON.stringify({
			chat_id : chatId,
			from_chat_id : chatId,
			message_id,
			...params
		  })
		})
		return response
	}
}





