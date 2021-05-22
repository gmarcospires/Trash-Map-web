const express = require('express');
const cors = require('cors');
const path = require('path')
const page = require('./server/routes/api/pages')
const app = express();
const posts = require('./server/routes/api/posts');
const serverSession = require("express-session")

app.use(serverSession({
    secret: '2C44-4D44-WppQ38S',
    resave: true,
    saveUninitialized: true
}))
app.set('views',path.join(__dirname,"./"))
app.set('view engine','hbs')
app.use(express.json());
app.use(cors());
app.use(express.static('./'))
app.use('/api/posts',posts)


const port = process.env.PORT || 5000;
app.listen(port, ()=>console.log(`Servidor iniciado na porta ${port}`));
app.get('/', page.inicio)
app.get('/index', page.inicio)
app.get('/cadastro', page.cadastro)
app.get('/coleta_adm', page.coleta)
app.get('/conta_adm', page.contaAdm)
app.get('/conta_aluno', page.contaAluno)
app.get('/feedback_aluno', page.feedback)
app.get('/index_adm', page.indexAdm)
app.get('/index_aluno', page.indexAluno)
app.get('/infoif_adm', page.info)
app.get('/login', page.login)
app.get('/ranking_adm', page.rankingAdm)
app.get('/ranking_aluno', page.rankingAluno)
app.get('/reestudo_adm', page.reestudo)
app.get('/sair',page.sair)

//npm test dev



