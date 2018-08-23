const path = require('path')
const express = require('express')
const app = express()
module.exports = (token) => {
	app.use('/public', express.static(path.join(__dirname, '../public'), {
		dotfiles: 'ignore',
		  extensions: ['css', 'js'],
		  index: false,
		  maxAge: '1d',
		  redirect: false,
	}))

	app.set('view engine', 'ejs');
	app.set('views', path.join(__dirname, '../views'));
	app.get('/', (req, res) => res.render('pages/index', {
		token: token.trim()
	}))

	app.listen(8080, () => console.log('Example app listening on port 8080!'))
}