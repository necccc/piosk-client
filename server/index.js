const express = require('express')
const app = express()

module.exports = (token) => {
	app.use('/public', express.static('public', {
		dotfiles: 'ignore',
		  extensions: ['css', 'js'],
		  index: false,
		  maxAge: '1d',
		  redirect: false,
	}))
	
	app.set('view engine', 'ejs');
	
	app.get('/', (req, res) => res.render('pages/index', {
		token
	}))
	app.listen(8080, () => console.log('Example app listening on port 8080!'))
}