import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as firebaseHelper from 'firebase-functions-helper';
import * as express from 'express';
import * as bodyParser from 'body-parser';


admin.initializeApp({
    credential: admin.credential.cert(require("../../serviceAccountKey.json")),
    databaseURL: "https://nrc-7828-4ad7b.firebaseio.com"
  });

const db = admin.firestore();

const app = express();
const main = express();

const collectionPersons = "persons";



main.use("/api", app);
main.use(bodyParser.json());
main.use(bodyParser.urlencoded({extended: false}));

export const api = functions.https.onRequest(main);

app.post('/persons', async (req, res) => {           
    try{      
        const newPerson = await firebaseHelper.firestore.createNewDocument(db, collectionPersons, req.body);
        res.status(201).send(`Person was added to collection with id ${newPerson.id}`);
    }
    catch(err){
        res.status(400).send(`An error has ocurred ${err}`)
    }
});
/*
app.get('/persons/:id', (req,res)=>{    
    firebaseHelper.firestore.getDocument(db, collectionPersons, req.params.id)
        .then(doc => res.status(200).send(doc))
        .catch(err => res.status(400).send(`An error has ocurred ${err}`));
});
*/

app.get('/persons/:id', async(req, res) => {
    let varId = req.params.id;
    try{
        const docObtained = await firebaseHelper.firestore.getDocument(db, collectionPersons, varId);
            res.status(200).send(docObtained);
    }catch(err){
        res.status(400).send(`An error has ocurred ${err}`)
    }
});

app.patch('/persons/:id', async(req, res) => {
    try{        
        const docUpdated = await firebaseHelper.firestore.updateDocument(db, 
            collectionPersons, req.params.id, req.body);
        res.status(200).send(`Person with id ${docUpdated}`);
    }
    catch(err){
        res.status(400).send(`An error has ocurred ${err}`);
    }
});

app.delete('/persons/:id', async (request, response) => {
    try{        
        const docDeleted = await firebaseHelper.firestore.deleteDocument(db, 
            collectionPersons, request.params.id);
        response.status(200).send(`Person was deleted ${docDeleted}`);
    }
    catch(err){
        response.status(400).send(`An error has ocurred ${err}`);
    }
});

app.get('/persons/minAge/:age', (req, res) =>{     
    let intAge = parseInt(req.params.age);
    let queryArray = [['age', '>=', intAge]];
    let orderBy = ['age','desc'];
    firebaseHelper.firestore.queryData(db, collectionPersons, queryArray, orderBy)
        .then(result => res.status(200).send(result))
        .catch(err => res.status(400).send(`An error has ocurred ${err}`));
});

app.get('/persons/maxAge/:age', (req, res) =>{     
    let intAge = parseInt(req.params.age);
    let queryArray = [['age', '<=', intAge]];
    let orderBy = ['age','desc'];
    firebaseHelper.firestore.queryData(db, collectionPersons, queryArray, orderBy)
        .then(result => res.status(200).send(result))
        .catch(err => res.status(400).send(`An error has ocurred ${err}`));
});

app.get('/persons', (req, res) =>{     
    firebaseHelper.firestore.backup(db, collectionPersons)
        .then(result => res.status(200).send(result))
        .catch(err => res.status(400).send(`An error has ocurred ${err}`));
});

export { app };

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
