const express = require('express')
//const bcrypt = require('bcryptjs')
//const jwt = require('jsonwebtoken')

const apiRouter = express.Router()

const knex = require('knex') ({
    client: 'pg',
    connection:  {
        connectionString : process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
    }
})
/*
let checkToken = (req, res, next) => {
    let authToken = req.headers["authorization"]
    if(!authToken) {
        res.status(401).json({ message: 'Token de acesso requerida.' })
    }
    else {
        let token = authToken.split(' ')[1]
        req.token = token
    }
    jwt.verify(req.token, process.env.SECRET_KEY, (err, decodeToken) => {
        if(err) {
            res.status(401).json({ message: 'Acesso Negado.' })
            return
        }
        req.usuarioId = decodeToken.id
        next()
    })
}

let isAdmin = (req, res, next) => { 
    knex 
        .select ('*').from ('usuario').where({ id: req.usuarioId }) 
        .then ((usuarios) => { 
            if (usuarios.length) { 
                let usuario = usuarios[0] 
                let roles = usuario.roles.split(';') 
                let adminRole = roles.find(i => i === 'ADMIN') 
                if (adminRole === 'ADMIN') { 
                    next() 
                    return 
                } 
                else { 
                    res.status(403).json({ message: 'Role de ADMIN requerida' }) 
                    return 
                } 
            } 
        }) 
        .catch (err => { 
            res.status(500).json({  
              message: 'Erro ao verificar roles de usuário - ' + err.message }) 
        }) 
}*/ 

// middleware processar o body em formato urlenconded
apiRouter.use(express.urlencoded({ extended: true }))
//middleware que processa o body em formato JSON
apiRouter.use(express.json())

// middleware Obter a lista de caronas do banco - RETRIEVE
apiRouter.get('/caronas', (req, res, next) => {
    knex.select('*')
        .from('carona')
        .then(caronas => {
            res.status(200).json(caronas)
        })
        .catch(err => { 
            res.status(500).json({  
            message: 'Erro ao recuperar carona - ' + err.message }) 
        })   
})
// middleware Obter um produto específico do banco - RETRIEVE
apiRouter.get('/caronas/:id', (req, res, next) => {
    knex.select('*')
       .from('carona')
       .where({ idcarona: req.params.id })
       .then(caronas => {
           if(caronas.length)
               res.status(200).json(caronas[0])
           else
               res.status(404).json({ message: 'Carona não encontrada!' })
       })
       .catch(err => { 
           res.status(500).json({  
           message: 'Erro ao recuperar carona - ' + err.message }) 
       })
})
// middleware Incluir uma carona (Post) no banco - CREATE
apiRouter.post('/caronas', (req, res, next) => {
    knex('carona')
        .insert({ idcidorigem: req.body.idcidorigem, idciddestino: req.body.idciddestino, vagas: req.body.vagas })
        .then(result => {
            res.status(201).json({ message: 'Carona incluída com sucesso!' })    
        })
        .catch(err => { 
            res.status(500).json({  
            message: 'Erro ao incluir carona - ' + err.message }) 
        })
})
// middleware Alterar uma carona (Put) no banco - UPDATE
apiRouter.put('/caronas/:id', (req, res, next) => {
    knex('carona')
        .where({ idcarona: req.params.id })
        .update({ idcidorigem: req.body.idcidorigem, idciddestino: req.body.idciddestino, vagas: req.body.vagas })
        .then(n => {
            if(n)
                res.status(200).json({ message: 'Carona alterado com sucesso!' })
            else
                res.status(404).json({ message: 'Carona não encontrado para alteração.' })
        })
        .catch(err => {
            res.status(500).json({ message: 'Erro na alteração - ' + err.message })
        })   
})
// middleware Excluir um carona no banco (Delete) - DELETE
apiRouter.delete('/caronas/:id', (req, res, next) => {
    knex('carona')
        .where({ idcarona: req.params.id })
        .del()
        .then(n => {
            if(n)
                res.status(200).json({ message: 'Carona excluída com sucesso!' })
            else
                res.status(404).json({ message: 'Carona não encontrada para exclusão.' })
        })
        .catch(err => {
            res.status(500).json({ message: 'Erro na exclusão - ' + err.message })
        })
})
/*
// middleware Obter a lista de caronas do banco - RETRIEVE
apiRouter.get('/caronas', checkToken, (req, res, next) => {
    knex.select('*')
        .from('carona')
        .then(caronas => {
            res.status(200).json(caronas)
        })
        .catch(err => { 
            res.status(500).json({  
            message: 'Erro ao recuperar carona - ' + err.message }) 
        })   
})

// middleware Obter uma carona específico do banco - RETRIEVE
apiRouter.get('/caronas/:id', checkToken, (req, res, next) => {
     knex.select('*')
        .from('carona')
        .where({ idCarona: req.params.id })
        .then(caronas => {
            if(caronas.length)
                res.status(200).json(caronas[0])
            else
                res.status(404).json({ message: 'Carona não encontrada!' })
        })
        .catch(err => { 
            res.status(500).json({  
            message: 'Erro ao recuperar carona - ' + err.message }) 
        })
})

// middleware Incluir uma carona (Post) no banco - CREATE
apiRouter.post('/caronas', checkToken, isAdmin, (req, res, next) => {
    knex('carona')
        .insert({ idcidorigem: req.body.idcidorigem, idciddestino: req.body.idciddestino, vagas: req.body.vagas })
        .then(result => {
            res.status(201).json({ message: 'Carona incluída com sucesso!' })    
        })
        .catch(err => { 
            res.status(500).json({  
            message: 'Erro ao incluir carona - ' + err.message }) 
        })
})

// middleware Alterar uma carona (Put) no banco - UPDATE
apiRouter.put('/caronas/:id', checkToken, isAdmin, (req, res, next) => {
    knex('carona')
        .where({ idCarona: req.params.id })
        .update({ idcidorigem: req.body.idcidorigem, idciddestino: req.body.idciddestino, vagas: req.body.vagas })
        .then(n => {
            if(n)
                res.status(200).json({ message: 'Carona alterada com sucesso!' })
            else
                res.status(404).json({ message: 'Carona não encontrada para alteração.' })
        })
        .catch(err => {
            res.status(500).json({ message: 'Erro na alteração - ' + err.message })
        })   
})

// middleware Excluir um carona no banco (Delete) - DELETE
apiRouter.delete('/caronas/:id', checkToken, isAdmin, (req, res, next) => {
    knex('carona')
        .where({ idCarona: req.params.id })
        .del()
        .then(n => {
            if(n)
                res.status(200).json({ message: 'Carona excluída com sucesso!' })
            else
                res.status(404).json({ message: 'Carona não encontrado para exclusão.' })
        })
        .catch(err => {
            res.status(500).json({ message: 'Erro na exclusão - ' + err.message })
        })
})*/

module.exports = apiRouter