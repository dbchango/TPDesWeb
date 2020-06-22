import * as main from './index';
import * as firebaseHelper from 'firebase-functions-helper';
import * as Router from 'express';

const routes = Router();
const db = main.db;
const collection = "persons"

interface Person {
    name: string,
    surname: string, 
    birth: string,
    place: string,
    email: string,
    address: string,
    phone: string
}

routes.post('/persons', async (req, res) => {           
    try{      
        const newPerson : Person = {
            name: req.body['name'],
            surname: req.body['surname'],
            birth: req.body['birth'],
            place: req.body['place'],
            email: req.body['email'],
            address: req.body['address'],
            phone: req.body['phone'],
        }
        const newAdded = await firebaseHelper.firestore
                            .createNewDocument(db, collection, newPerson);
        res.status(201).send(`Person was added to collection with id ${newAdded.id}`);
    }
    catch(err){
        res.status(400).send(`An error has ocurred ${err}`)
    }
});

routes.get('/persons/:id', async(req, res) => {
    let varId = req.params.id;
    try{
        const docObtained = await firebaseHelper.firestore.getDocument(db, collection, varId);
            res.status(201).send(docObtained);
    }catch(err){
        res.status(400).send(`An error has ocurred ${err}`)
    }
});

routes.patch('/persons/:id', async(req, res) => {
    try{      
        let id = req.params.id;
        const Person : Person = {
            name: req.body['name'],
            surname: req.body['surname'],
            birth: req.body['birth'],
            place: req.body['place'],
            email: req.body['email'],
            address: req.body['address'],
            phone: req.body['phone'],
        };  
        await firebaseHelper.firestore.updateDocument(db, 
            collection, id, Person);
        res.status(200).send(`Person with id ${id} was updated`);
    }
    catch(err){
        res.status(400).send(`An error has ocurred ${err}`);
    }
});

routes.delete('/persons/:id', async (request, response) => {
    let id = request.params.id;
    try{        
        const docDeleted = await firebaseHelper.firestore.deleteDocument(db, 
            collection, id);
        response.status(200).send(`Person with ${docDeleted} was deleted`);
    }
    catch(err){
        response.status(400).send(`An error has ocurred ${err}`);
    }
});



routes.get('/persons', (req, res) =>{     
    firebaseHelper.firestore.backup(db, collection)
        .then(result => res.status(200).send(result))
        .catch(err => res.status(400).send(`An error has ocurred ${err}`));
});

export { routes };

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });


/*
routes.get('/persons/minAge/:age', (req, res) =>{     
    let intAge = parseInt(req.params.age);
    let queryArray = [['age', '>=', intAge]];
    let orderBy = ['age','desc'];
    firebaseHelper.firestore.queryData(db, collection, queryArray, orderBy)
        .then(result => res.status(200).send(result))
        .catch(err => res.status(400).send(`An error has ocurred ${err}`));
});

routes.get('/persons/maxAge/:age', (req, res) =>{     
    let intAge = parseInt(req.params.age);
    let queryArray = [['age', '<=', intAge]];
    let orderBy = ['age','desc'];
    firebaseHelper.firestore.queryData(db, collection, queryArray, orderBy)
        .then(result => res.status(200).send(result))
        .catch(err => res.status(400).send(`An error has ocurred ${err}`));
});*/