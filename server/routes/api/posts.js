const express = require('express');
// const serverSession = require("express-session")
const mongodb = require('mongodb');
var bodyParser = require('body-parser')

// const app = express();
var jsonParser = bodyParser.json()
var urlEncodedParser = bodyParser.urlencoded({
    extended: true
})
// app.use(serverSession({
//     secret: '2C44-4D44-WppQ38S',
//     resave: true,
//     saveUninitialized: true
// }))

const router = express.Router();

const uri = "mongodb+srv://marcos8370:Acer2016@cluster0.72glp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new mongodb.MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

//Coleta
//Listar todos os posts de Coleta
async function loadPostsCollectionColeta() {
    await client.connect();
    return client.db('Veferoma').collection('Coleta');
}
//GET  order
router.get("/Coleta/order/:tipo", async (req, res) => {
    const posts = await loadPostsCollectionColeta();
    let u = await posts.find({
        tipoLixo: req.params.tipo
    }, {
        "qtd_Coletada_Total": -1
    }).sort({
        "qtd_Coletada_Total": -1
    }).toArray();
    client.close
    res.send(u);

})
//GET all
router.get("/Coleta", async (req, res) => {
    const posts = await loadPostsCollectionColeta();
    let u = await posts.find({}).toArray();
    client.close
    res.send(u);
})
//GET agregate
// router.get("/Coleta/all", async (req, res) => {
//     const posts = await loadPostsCollectionColeta();
//     // res.send(await posts.find({
//     // }) .toArray());
//     res.send(posts.aggregate([{
//         $group: {
//             if: "$if",
//             total: {$sum: "$qtd_Coletada_Total"} 
//         }
//     }]).toArray())
// })
//GET :campus
router.get("/Coleta/:campus", async (req, res) => {
    const posts = await loadPostsCollectionColeta();

    let u = await posts.find({
        if: req.params.campus
    }, {
        "qtd_Coletada_Total": -1
    }).sort({
        "qtd_Coletada_Total": -1
    }).toArray();
    res.send(u)
    client.close

})
//Crar posts (DEV)
router.post('/Coleta', urlEncodedParser, async (req, res) => {
    const posts = await loadPostsCollectionColeta();
    await posts.insertOne({
        qtd_Coletada: req.body.qtd_Coletada,
        if: req.body.if,
        if_cod: req.body.if_cod,
        qtd_Coletada_Total: req.body.qtd_Coletada,
        tipoLixo: req.body.tipoLixo,
        data: req.body.data,
        total: 0
    });
    client.close
    res.status(201).send();
})
//Update posts
router.post('/Coleta/:if/:tipoLixo', urlEncodedParser, async (req, res) => {
    const posts = await loadPostsCollectionColeta();
    await posts.updateOne({
        if: req.params.if,
        tipoLixo: req.params.tipoLixo
    }, {
        $set: {
            qtd_Coletada: req.body.qtd_Coletada,
            data: req.body.data
        },
        $inc: {
            qtd_Coletada_Total: req.body.qtd_Coletada_Total
        }
    })
    client.close
    res.status(200).send();
})
//Update posts
router.post('/Coleta/update', urlEncodedParser, async (req, res) => {
    const posts = await loadPostsCollectionColeta();
    if (req.body.idxTipo == null || req.body.idxTipo == "Selecione" || req.body.data == null || req.body.data == "") {
        req.session.ok = "2"
        client.close
        res.redirect("/coleta_adm")
    } else {
        let tipo = req.body.idxTipo.split(" - ")
        req.session.ok = "2";
        req.body.data = req.body.data + ""
        let coletah = req.body.qtd_Coletada * 1.0

        if (req.session.if != null) {
            try {
                await posts.updateOne({
                    if: req.session.if,
                    tipoLixo: tipo[1]
                }, {
                    $inc: {
                        qtd_Coletada_Total: coletah
                    },
                    $set: {
                        data: req.body.data,
                        qtd_Coletada: coletah
                    }
                })
                req.session.ok = "1";
                client.close
                res.redirect("/coleta_adm");
            } catch (e) {
                req.session.ok = "2";
                client.close
                res.redirect("/coleta_adm");
            }
        } else {
            client.close
            res.redirect("/coleta_adm");
        }
    }

})
//Apagar posts (DEV)
router.delete('/Coleta/:id', async (req, res) => {
    const posts = await loadPostsCollectionColeta();
    await posts.deleteOne({
        _id: new mongodb.ObjectID(req.params.id)
    });
    client.close
    res.status(200).send();
})

//Feedback
//Listar todos os posts de Feedback
async function loadPostsCollectionFeedback() {
    await client.connect();
    return client.db('Veferoma').collection('Feedback');
}
//GET all
router.get("/Feedback", async (req, res) => {
    const posts = await loadPostsCollectionFeedback();
    let u = await posts.find({}).toArray()
    client.close
    res.send(u);
})
    //GET :campus
router.get("/Feedback/:campus",async(req,res)=>{
    const posts = await loadPostsCollectionFeedback();
    let u = await posts.find({
        if: req.params.campus
    }).toArray();
    client.close
    res.send(u);
})
 //GET :campus count
 router.get("/Feedback/p/:campus",async(req,res)=>{
    const posts = await loadPostsCollectionFeedback();
    let u = await posts.find({
        if: req.params.campus,
        op: 1
    }).toArray();
    client.close
    let b = u.length
    res.send(b+"");
})
//GET :campus count
router.get("/Feedback/n/:campus",async(req,res)=>{
    const posts = await loadPostsCollectionFeedback();
    let u = await posts.find({
        if: req.params.campus,
        op: 0
    }).toArray();
    client.close
    let b = u.length
    res.send(b+"");
})
//Crar posts
router.post('/Feedback', urlEncodedParser, async (req, res) => {
    const posts = await loadPostsCollectionFeedback();
    await posts.insertOne({
        if: req.body.if,
        if_cod: req.body.if_cod,
        titulo: req.body.titulo,
        texto: req.body.texto,
        op: req.body.op
    });
    req.session.ok = "1";
    client.close
    res.redirect("/feedback_aluno");
    //res.redirect("/feedback_aluno");
})
//Apagar posts (DEV)
router.delete('/Feedback/:id', async (req, res) => {
    const posts = await loadPostsCollectionFeedback();
    await posts.deleteOne({
        _id: new mongodb.ObjectID(req.params.id)
    });
    client.close
    res.status(200).send();
})


//Instituto
//Listar todos os posts de Istituto
async function loadPostsCollectionInstituto() {
    await client.connect();
    return client.db('Veferoma').collection('Instituto');
}
//GET all
router.get("/Instituto", async (req, res) => {
    const posts = await loadPostsCollectionInstituto();
    let u = await posts.find({}).toArray()
    client.close
    res.send(u);
})
//GET :campus
router.get("/Instituto/:campus", async (req, res) => {
    const posts = await loadPostsCollectionInstituto();
    let u = await posts.find({
        campus: req.params.campus
    }).toArray()
    client.close
    res.send(u);
})

// //Crar posts
// router.post('/Instituto', async(req,res)=>{
//     const posts = await loadPostsCollection();
//    await posts.insertOne({
//         campus: req,
//         data: "12/05"
//    });
//    res.status(201).send();
// })
//Apagar posts
// router.delete('/:id', async(req,res)=>{
//     const posts = await loadPostsCollection();
//     await posts.deleteOne({
//         _id:  new mongodb.ObjectID(req.params.id)
//     });
//     res.status(201).send();
// })


//Mudanca
//Listar todos os posts de Mudanca
async function loadPostsCollectionMudanca() {
    await client.connect();
    return client.db('Veferoma').collection('Mudanca');
}
//GET all (DEV)
router.get("/Mudanca", async (req, res) => {
    const posts = await loadPostsCollectionMudanca();
    let u = await posts.find({}).toArray()
    client.close
    res.send(u);
})
//     //GET :campus
// router.get("/Feedback/:campus",async(req,res)=>{
//     const posts = await loadPostsCollectionMudanca();
//     res.send(await posts.find({
//         if: req.params.campus
//     }).toArray());
// })
//Crar posts
router.post('/Mudanca', urlEncodedParser, async (req, res) => {
    const posts = await loadPostsCollectionMudanca();

    if (req.body.idxTipo == null || req.body.idxTipo == "Selecone" || req.body.det == "" || req.body.det == null) {
        req.session.ok = "2";
        res.redirect("/reestudo_adm")
    } else {
        try {
            let u = req.body.idxTipo.split(" - ")
            u[0] = u[0] * 1

            await posts.insertOne({
                ponto: u[0],
                det: req.body.det,
                mapa: "",
                if: req.session.if,
                if_cod: req.session.if_cod
            });

            req.session.ok = "1";
            client.close
            res.redirect("/reestudo_adm");
        } catch {
            req.session.ok = "2";
            client.close
            res.redirect("/reestudo_adm");
        }

    }

})
//Apagar posts (DEV)
router.delete('/Mudanca/:id', async (req, res) => {
    const posts = await loadPostsCollectionMudanca();
    await posts.deleteOne({
        _id: new mongodb.ObjectID(req.params.id)
    });
    client.close
    res.status(200).send();
})


//Ponto
//Listar todos os posts de Ponto
async function loadPostsCollectionPonto() {
    await client.connect();
    return client.db('Veferoma').collection('Ponto');
}
//GET all (DEV)
router.get("/Ponto", async (req, res) => {
    const posts = await loadPostsCollectionPonto();
    let u = await posts.find({}).toArray()
    client.close
    res.send(u);
})
//GET :if
router.get("/Ponto/:if", async (req, res) => {
    const posts = await loadPostsCollectionPonto();
    let u = await posts.find({
        if: req.params.if
    }).toArray()
    client.close
    res.send(u);
})
//GET :indice
router.get("/Ponto/:index/:if/:tipo", async (req, res) => {
    const posts = await loadPostsCollectionPonto();
    let u = await posts.find({
        if: req.params.if,
        index: req.params.index
    }).toArray()
    client.close
    res.send(u);
})
//Crar posts (DEV)
router.post('/Ponto', urlEncodedParser, async (req, res) => {
    const posts = await loadPostsCollectionPonto();
    await posts.insertOne({
        ponto: req.body.ponto,
        det: req.body.det,
        mapa: null,
        if: req.body.if,
        if_cod: req.body.if_cod
    });
    client.close
    res.status(201).send();
})
//Apagar posts (DEV)
router.delete('/Ponto/:id', async (req, res) => {
    const posts = await loadPostsCollectionPonto();
    await posts.deleteOne({
        _id: new mongodb.ObjectID(req.params.id)
    });
    client.close
    res.status(200).send();
})


//TipoLixo (DEV)
/* //Listar todos os posts de Ponto
async function loadPostsCollectionTipoLixo(){
    await client.connect();
    return client.db('Veferoma').collection('Tipo_lixo');
}
    //GET all (DEV)
router.get("/Tipo",async(req,res)=>{
    const posts = await loadPostsCollectionTipoLixo();
    res.send(await posts.find({}).toArray());
})
//     //GET :id
// router.get("/Tipo/:id",async(req,res)=>{
//     const posts = await loadPostsCollectionTipoLixo();
//     res.send(await posts.find({
//         id: req.params.id
//     }).toArray());
// })
 //Crar posts (DEV)
router.post('/Tipo', async(req,res)=>{
    const posts = await loadPostsCollectionTipoLixo();
   await posts.insertOne({
        ponto: req.body.ponto,
        det: req.body.det,
        mapa:null,
        if: req.body.if,
        if_cod: req.body.if_cod
   });
   res.status(201).send();
})
//Apagar posts (DEV)
router.delete('/Tipo/:id', async(req,res)=>{
    const posts = await loadPostsCollectionTipoLixo();
    await posts.deleteOne({
        _id:  new mongodb.ObjectID(req.params.id)
    });
    res.status(200).send();
}) */

//Usuário
//Listar todos os posts de Coleta
async function loadPostsCollectionUsuario() {
    await client.connect();
    await client.db('Veferoma').collection('Usuario').createIndex({
        usuario: 1
    }, {
        unique: true
    });
    return client.db('Veferoma').collection('Usuario');
}
//GET all
router.get("/Usuario", async (req, res) => {
    const posts = await loadPostsCollectionUsuario();
    let u = await posts.find({}).toArray()
    client.close
    res.send(u);
})
//GET :usr
router.get("/Usuario/:usr", async (req, res) => {
    const posts = await loadPostsCollectionUsuario();
    let u = await posts.find({
        usuario: req.params.usr
    }).toArray()
    client.close
    res.send(u);
})
//GET verifica:usr
router.get("/Usuario/verifica/:usr", async (req, res) => {
    const posts = await loadPostsCollectionUsuario();
    let uu = await posts.find({
        usuario: req.params.usr
    }).toArray();
    if (uu.length != 0) {
        client.close
        res.send(true)
    } else {
        client.close
        res.send(false)
    }
})
//Login
router.post('/Usuario/Login', urlEncodedParser, async (req, res) => {
    const posts = await loadPostsCollectionUsuario();
    try {
        let u = await posts.find({
            usuario: req.body.usuario,
            senha: req.body.senha
        }).toArray();
        if (u[0]) {
            if (u[0].adm == true) {
                req.session.usuario = u[0].usuario;
                req.session.if = u[0].if;
                req.session.nome = u[0].nome;
                req.session.email = u[0].email;
                req.session.matricula = u[0].matricula
                req.session.if_cod = u[0].if_cod
                req.session.adm = u[0].adm
                client.close
                res.redirect("/index_adm")
            } else {
                req.session.usuario = u[0].usuario;
                req.session.if = u[0].if;
                req.session.nome = u[0].nome;
                req.session.email = u[0].email;
                req.session.ra = u[0].ra;
                req.session.if_cod = u[0].if_cod
                client.close
                res.redirect("/index_aluno")
            }
        } else {
            client.close
            req.session.ok = "1";
            res.redirect("/login")
        }
    } catch (err) {
        client.close
        req.session.ok = "1";
        res.redirect("/login")
    }
})
//Crar posts
router.post('/Usuario', urlEncodedParser, async (req, res) => {
    const posts = await loadPostsCollectionUsuario();
    if (req.body.if == "-1" || req.body.if == null || req.body.nome == null || req.body.usuario == null || req.body.senha == null || req.body.email == null || req.body.ra == null) {
        req.body = null
        req.session.ok = "2";
        client.close
        res.redirect("/cadastro")
    }
    var aux = req.body.if
    var aux = aux.split(" / ")
    req.session.ok = "2";
    try {
        await posts.insertOne({
            nome: req.body.nome,
            usuario: req.body.usuario,
            senha: req.body.senha,
            if: aux[0],
            if_cod: aux[1],
            email: req.body.email,
            ra: req.body.ra,
            adm: false
        });
        client.close
        req.session.ok = "1";
        res.redirect("/cadastro");
    } catch {
        client.close
        req.session.ok = "2";
        res.redirect("/cadastro")

    }


})
//Update posts
router.post('/Usuario/alt', urlEncodedParser, async (req, res) => {
    const posts = await loadPostsCollectionUsuario();

    if (req.body.senhaN != null) {
        let u = await posts.find({
            usuario: req.session.usuario,
            senha: req.body.senha
        }).toArray();
        if (u[0]) {
            await posts.updateOne({
                usuario: req.session.usuario
            }, {
                $set: {
                    senha: req.body.senhaN
                }
            })
            req.session.ok = "1";
        } else {
            req.session.ok = "2";
        }
        if (req.session.adm) {
            client.close
            res.redirect("/conta_adm")
        } else {
            client.close
            res.redirect("/conta_aluno");
        }

    }
    if (req.body.email != null) {
        await posts.updateOne({
            usuario: req.session.usuario
        }, {
            $set: {
                usuario: req.body.emailN
            }
        })
        req.session.email = req.body.emailN
        req.session.ok = "1";
        if (req.session.adm) {
            client.close
            res.redirect("/conta_adm")
        } else {
            client.close
            res.redirect("/conta_aluno");
        }
    }
    if (req.body.usuarioN != null) {
        try {
            await posts.updateOne({
                usuario: req.session.usuario
            }, {
                $set: {
                    usuario: req.body.usuarioN
                }
            })
        } catch (e) {
            req.session.ok = "2";
            if (req.session.adm) {
                client.close
                res.redirect("/conta_adm")
            } else {
                client.close
                res.redirect("/conta_aluno");
            }
        }

        req.session.usuario = req.body.usuarioN
        req.session.ok = "1";
        if (req.session.adm) {
            client.close
            res.redirect("/conta_adm")
        } else {
            client.close
            res.redirect("/conta_aluno");
        }
        //res.redirect("/conta_aluno");
    }

})
//Apagar posts (DEV)
router.delete('/Usuario/:id', async (req, res) => {
    const posts = await loadPostsCollectionUsuario();
    await posts.deleteOne({
        _id: new mongodb.ObjectID(req.params.id)
    });
    client.close
    res.status(200).send();
})

module.exports = router