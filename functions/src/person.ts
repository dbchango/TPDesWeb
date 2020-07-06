import * as main from './index';
import * as firebaseHelper from 'firebase-functions-helper';
import * as Router from 'express';

const routes = Router();
const db = main.db;
const collection = "persons";

interface Person {
    idperson?: string,
    name: string,
    surname: string,
    birth: string,
    place: string,
    email: string,
    address: string,
    phone: string
}

function getPerson(id: string, data:any){
    let object : Person = {
        idperson: id,
        name: data.name,
        surname: data.surname,
        birth: data.birth,
        place: data.place,
        email: data.email,
        address: data.address,
        phone: data.phone

    }
    return object
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
            phone: req.body['phone']
        };      
        const personAdded = await firebaseHelper.firestore
                                .createNewDocument(db, collection, newPerson);
        res.status(201).json(main.Message('Persona aniadida', `Persona con el id: ${personAdded.id} aniadida`, 'success'));
    }
    catch(err){
        res.status(400).json(main.Message('Un error ha ocurrido',`${err}`, 'error'))
    }
});

routes.get('/persons/:id', (req,res)=>{    
    firebaseHelper.firestore
        .getDocument(db, collection, req.params.id)
        .then(doc => res.status(200).json(getPerson(doc.id, doc)))
        .catch(err => res.status(400).json(main.Message('Un error ha ocurrido',`${err}`, 'error')));
});

routes.patch('/persons/:id', async(req, res) => {
    try{       
        var id = req.params.id;
        const person : Person = {
            name: req.body['name'],
            surname: req.body['surname'],
            birth: req.body['birth'],
            place: req.body['place'],
            email: req.body['email'],
            address: req.body['address'],
            phone: req.body['phone']
        }; 
        await firebaseHelper.firestore.updateDocument(db, collection, id, person);
        res.status(200).json(main.Message('Persona modificada', `Persona con el id: ${id} modificada`, 'success') );
    }
    catch(err){
        res.status(400).json(main.Message('Un error ha ocurrido',`${err}`, 'error'));
    }
});

routes.delete('/persons/:id', async (request, response) => {
    try{        
        let id = request.params.id;
        await firebaseHelper.firestore.deleteDocument(db, collection, id);
        response.status(200).send(`Person document with id ${id} was deleted`);
    }
    catch(err){
        response.status(400).json(main.Message('Un error ha ocurrido',`${err}`, 'error'));
    }
});

routes.get('/persons', (req, res) =>{     
    db.collection(collection).get()
        .then(result => {
            res.status(200).json(result.docs.map(doc=>getPerson(doc.id, doc.data())));
        })
        .catch(err => res.json(main.Message('Un error ha ocurrido',`${err}`, 'error')));
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