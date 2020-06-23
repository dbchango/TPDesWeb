import * as main from './index';
import * as firebaseHelper from 'firebase-functions-helper';
import * as Router from 'express';

const routes = Router();
const db = main.db;
const collection = "subjects";

interface Subject {
    name: string,
    nrc: string,
    hours: number,
    category: string
}

routes.post('/subjects', async (req, res) => {           
    try{            
        const newSubject : Subject = {
            name: req.body['name'],
            nrc: req.body['nrc'],
            hours: req.body['hours'],
            category: req.body['category']            
        };      
        const SubjectAdded = await firebaseHelper.firestore
                                .createNewDocument(db, collection, newSubject);
        res.status(201).send(`Subject was added to collection with id ${SubjectAdded.id}`);
    }
    catch(err){
        res.status(400).send(`An error has ocurred ${err}`)
    }
});

routes.get('/subjects/:id', (req,res)=>{    
    firebaseHelper.firestore
        .getDocument(db, collection, req.params.id)
        .then(doc => res.status(200).send(doc))
        .catch(err => res.status(400).send(`An error has ocurred ${err}`));
});

routes.patch('/subjects/:id', async(req, res) => {
    try{       
        let id = req.params.id;
        const Subject : Subject = {
            name: req.body['name'],
            nrc: req.body['nrc'],
            hours: req.body['hours'],
            category: req.body['category'] 
        }; 
        await firebaseHelper.firestore.updateDocument(db, collection, id, Subject);
        res.status(200).send(`Subject with id ${id} was updated`);
    }
    catch(err){
        res.status(400).send(`An error has ocurred ${err}`);
    }
});

routes.delete('/subjects/:id', async (request, response) => {
    try{        
        let id = request.params.id;
        await firebaseHelper.firestore.deleteDocument(db, collection, id);
        response.status(200).send(`Subject document with id ${id} was deleted`);
    }
    catch(err){
        response.status(400).send(`An error has ocurred ${err}`);
    }
});

routes.get('/subjects', (req, res) =>{     
    firebaseHelper.firestore.backup(db, collection)
        .then(result => res.status(200).send(result))
        .catch(err => res.status(400).send(`An error has ocurred ${err}`));
});

export { routes };