 const router = require("./posts");
 const mongodb = require('mongodb');
const session = require("express-session");
 const uri = "mongodb+srv://marcos8370:Acer2016@cluster0.72glp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
 const client = new mongodb.MongoClient(uri, {
     useNewUrlParser: true,
     useUnifiedTopology: true
 });


 module.exports = {
     inicio(req, res) {
        req.session.destroy();
         res.render("index");
     },
     sair(req,res){
         req.session.destroy(); 
         res.redirect("/index");
     },
     async cadastro(req, res) {
         await client.connect();
         var cad = client.db('Veferoma').collection('Instituto');
         var dado = await cad.find({}).toArray();
         client.close
         if (req.session.ok == "1" || req.session.ok == "2") {
             let ok = req.session.ok;
             req.session.ok = "0";
             res.render("cadastro", {
                 dado,
                 ok
             });
         }
         req.session.destroy
         req.session = null
         res.render("cadastro", {
             dado
         });
     },
     async coleta(req, res) {
         if(!req.session || req.session == null){
            res.redirect("/login")
         }
        await client.connect();
        var cad = client.db('Veferoma').collection('Ponto');
        dado = await cad.find({
            if: req.session.if
        }).toArray();
        client.close
        if (req.session.ok == "1" || req.session.ok == "2") {
            let ok = req.session.ok;
            req.session.ok = "0";
            res.render("coleta_adm", {
                dado,
                ok
            });
        }
        res.render("coleta_adm",{dado});
     },
     contaAdm(req, res) {
        if(!req.session || req.session == null){
            res.redirect("/login")
         }
        var aluno = req.session
         if (req.session.ok == "1" || req.session.ok == "2") {
             let ok = req.session.ok;
             req.session.ok = "0";
             res.render("conta_adm", {
                 aluno,
                 ok
             });
         }
         res.render("conta_adm", {
             aluno
         });
     },
     contaAluno(req, res) {
        if(!req.session || req.session == null){
            res.redirect("/login")
         }
         var aluno = req.session
         if (req.session.ok == "1" || req.session.ok == "2") {
             let ok = req.session.ok;
             req.session.ok = "0";
             res.render("conta_aluno", {
                 aluno,
                 ok
             });
         }
         res.render("conta_aluno", {
             aluno
         });
     },
     async feedback(req, res) {
        if(!req.session || req.session == null){
            res.redirect("/login")
         }
         await client.connect();
         var cad = client.db('Veferoma').collection('Instituto');
         var instituto = await cad.find({
             campus: req.session.if
         }).toArray();
         client.close
         if(instituto == null || instituto[0] == null){
            res.redirect("/login")
        }
         instituto = instituto[0]
         if (req.session.ok == "1") {
             req.session.ok = "0";
             let ok = "1";
             res.render("feedback_aluno", {
                 instituto,
                 ok
             });
         }
         res.render("feedback_aluno", {
             instituto
         });

     },
     async indexAdm(req, res) {
        if(!req.session || req.session == null){
            res.redirect("/login")
         }
        await client.connect();
         var cad1 = client.db('Veferoma').collection('Coleta');
         var dado = await cad1.find({
             if: req.session.if}, {
             "qtd_Coletada_Total": -1
         }).sort({
             "qtd_Coletada_Total": -1
         }).toArray();
        var cad = client.db('Veferoma').collection('Instituto');
        var dado1 = await cad.find({
            campus: req.session.if
        }).toArray();
        if(dado == null || dado[0] == null){
            res.redirect("/login")
        }
        client.close
        dado1 = dado1[0].s_loc
         var info = {
             nome: req.session.nome
         }
         res.render("index_adm", {
             info,
             dado1,
             dado
         });
     },
     async info(req, res) {
        if(!req.session || req.session == null){
            res.redirect("/login")
         }
        await client.connect();
        var cad = client.db('Veferoma').collection('Instituto');
        var dado = await cad.find({
            campus: req.session.if
        }).toArray();
        if(dado == null || dado[0] == null){
            res.redirect("/login")
        }
        dado = dado[0]
        client.close
        res.render("infoif_adm", {
            dado
        });
     },
     async indexAluno(req, res) {
        if(!req.session || req.session == null){
            res.redirect("/login")
         }
        await client.connect();
        var cad = client.db('Veferoma').collection('Instituto');
        var dado = await cad.find({
            campus: req.session.if
        }).toArray();
        if(dado == null || dado[0] == null){
            res.redirect("/login")
        }
        dado = dado[0].s_loc
         var info = {
             nome: req.session.nome
         }
         client.close
         res.render("index_aluno", {
             info,dado
         });
     },
     async login(req, res) {
         if (req.session.ok == "1") {
             req.session.ok = "0";
             let ok = "1";
             await res.render("login", {
                 ok
             });
         }
         req.session.destroy
         res.session = null
         res.render("login");
     },
     async rankingAdm(req, res) {
        if(!req.session || req.session == null){
            res.redirect("/login")
         }
         await client.connect();
         var cad = client.db('Veferoma').collection('Tipo_Lixo');
         var tipoLixo = await cad.find({}).toArray()
         var cad1 = client.db('Veferoma').collection('Coleta');
         var dado = await cad1.find({
             if: req.session.if
         }, {
             "qtd_Coletada_Total": -1
         }).sort({
             "qtd_Coletada_Total": -1
         }).toArray()
         client.close
         let iff = req.session.if
         res.render("ranking_adm", {
             tipoLixo,
             dado, 
             iff
         });
     },
     async rankingAluno(req, res) {
        if(!req.session || req.session == null){
            res.redirect("/login")
         }
         await client.connect();
         var cad = client.db('Veferoma').collection('Tipo_Lixo');
         var tipoLixo = await cad.find({}).toArray()
         var cad11 = client.db('Veferoma').collection('Coleta');
         var dado = await cad11.find({
             if: req.session.if
         }, {
             "qtd_Coletada_Total": -1
         }).sort({
             "qtd_Coletada_Total": -1
         }).toArray()
         client.close
         let iff = req.session.if
         res.render("ranking_aluno", {
             tipoLixo,
             dado,
             iff
         });
     },
     async reestudo(req, res) {
        if(!req.session || req.session == null){
            res.redirect("/login")
         }
        await client.connect();
        var cad = client.db('Veferoma').collection('Ponto');
        dado = await cad.find({
            if: req.session.if
        }).toArray();
        client.close
        if (req.session.ok == "1" || req.session.ok == "2") {
            let ok = req.session.ok;
            req.session.ok = "0";
            res.render("reestudo_adm", {
                dado,
                ok
            });
        }
        res.render("reestudo_adm",{dado});
     }

 }