bot = new Bot(TOKEN)

const like = {
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [ { text: '❤️', callback_data: 'like' }, { text: '💔', callback_data: 'notLike' } ]
      ]
    })
};

const home = {
	reply_markup: JSON.stringify({
		keyboard: [
			[{text: 'Me 💔'}, { text: 'Me ❤️'}]
		],
		resize_keyboard: true
	})
}

bot.on('text', (msg) => {
	let chatId = msg.chat.id
	if(msg.text == 'Me 💔') {
		bot.notLikeImages(msg.chat.id)
		return
	}
	if(msg.text == 'Me ❤️') {
		bot.likeImages(msg.chat.id)
		return
	}
	if(msg.text == '/start') {
		bot.sendMessage(chatId, 'Bu bot bilan siz ozingizga yoqadigan rasmlarni topishingiz mumkin ishonmasangiz sinab koring', home)
	} else {
		bot.sendPhoto(chatId, msg.text, like)
	}
})

bot.start()
