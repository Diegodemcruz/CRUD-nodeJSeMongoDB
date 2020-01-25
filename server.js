const express = require('express')
const bodyParser = require('body-parser')

const app = express();

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://demcruz:12345@cluster0-wjufl.mongodb.net/test?retryWrites=true";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.urlencoded({ extended: true }));



client.connect(err => {
   db = client.db("test").collection("books");    
    
    app.listen(3000, function() {
        console.log("servidor na porta 3000");
    });
   
});



app.set('view engine', 'ejs');


//Get Method - 
app.get('/', (req, res) => {
    res.render('template.ejs');
});

app.get('/', (req, res) =>{
    const busca = db.find();
});

app.get('/show', (req, res) => {
    db.find().toArray((err, results) =>{
        if (err) return console.log("Error:" + err);
        res.render('show.ejs', { books: results });
    });
});


//EDIT - Editar
var ObjectId = require('mongodb').ObjectID;

app.route('/edit/:id')
    .get((req, res) =>{
        var id = req.params.id;

    db.find(ObjectId(id)).toArray((err, result) => {
        if(err) return console.log("Error " + err);
        res.render('edit.ejs', { books: result });
    });
})
.post((req, res) =>{
    var id = req.params.id;
    var title = req.body.title;
    var author = req.body.author;
    var genre = req.body.genre;

    db.updateOne({_id: ObjectId(id)}, {
        $set: {
            title: title,
            author: author,
            genre: genre
        }
    }, (err, result) => {
        if(err) return res.send(err);
        res.redirect('/show');
        console.log("Registro atualizado com sucesso !");
    })
});

//Deletar
app.route('/delete/:id')
    .get((req, res) =>{
        var id = req.params.id;

        db.deleteOne({_id: ObjectId(id)}, (err, result) =>{
            if (err) return res.send(500, err);
            console.log("Registro eliminado com sucesso !");
            res.redirect('/show');
        });
    });


//Post method - Criar
app.post('/show', (req, res) => {
    db.insertOne(req.body, (err, result) => {
        if (err)
            return console.log("Erro " + err);

        console.log("Registro guardado com sucesso no BD");
        res.redirect('/');

        db.find().toArray((err, results) => {
                console.log(results);
        });
    });
});

