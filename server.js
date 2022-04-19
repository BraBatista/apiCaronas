// no heroku não vai ter esse arquivo, então não vai ler (.gitignore) 
require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const apiRouter = require('./routers/apiRouter')
const secRouter = require('./routers/secRouter')
const app = express()

// middleware de log
app.use(morgan('common'))

//middleware static - página inicial html
app.use('/app', express.static('public'))

// middlewares apiRouter que estão no path /api
app.use('/api', apiRouter)

// secRouter path /seguranca
app.use('/seguranca', secRouter)

// middleware bem-vindo --> https://apicaronas.herokuapp.com/
app.get('/', (req, res, next) => {
    res.send('Bem-vindo ao CaronasApi... <br>Use os endpoints para acessar os dados. ex: /api/caronas')
})

const PORTA = process.env.PORT || 3000
app.listen(PORTA, () => {
    console.log(`Servidor rodando em http://localhost:${PORTA}`)
}) 