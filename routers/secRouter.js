const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken') 

const secRouter = express.Router()

// middleware teste
secRouter.get('/', (req, res, next) => {
    res.send('API de segurança')
}) 

// middleware de segurança, Inserir um novo usuário no banco
secRouter.post ('/register', (req, res) => { 
    knex ('usuario') 
        .insert({ 
            nome: req.body.nome,  
            login: req.body.login,  
            senha: bcrypt.hashSync(req.body.senha, 8),  
            email: req.body.email 
        }, ['id']) 
        .then((result) => { 
            let usuario = result[0] 
            res.status(200).json({"id": usuario.id })  
            return 
        }) 
        .catch(err => { 
            res.status(500).json({  
                message: 'Erro ao registrar usuário - ' + err.message }) 
        })   
})

// middleware de segurança, Login e gerar token
secRouter.post('/login', (req, res) => {  
    knex 
      .select('*')
      .from('usuario')
      .where({ login: req.body.login }) 
      .then( usuarios => { 
          if(usuarios.length){ 
              let usuario = usuarios[0] 
              let checkSenha = bcrypt.compareSync(req.body.senha, usuario.senha) 
              if(checkSenha) { 
                var tokenJWT = jwt.sign({ id: usuario.id }, process.env.SECRET_KEY, { 
                    expiresIn: 3600 
                }) 
 
                res.status(200).json ({ 
                    id: usuario.id, 
                    login: usuario.login,  
                    nome: usuario.nome,  
                    roles: usuario.roles, 
                    token: tokenJWT 
                })   
                return  
              } 
          }  
             
          res.status(401).json({ message: 'Login ou senha incorretos.' }) 
      }) 
      .catch (err => { 
          res.status(500).json({  
             message: 'Erro ao verificar login - ' + err.message }) 
      }) 
})

module.exports = secRouter