import * as main from './index';
import * as firebaseHelper from 'firebase-functions-helper';
import * as Router from 'express';

const routes = Router();
const db = main.db;
const collection = "subjects"

interface Subject {
    name: string,
    nrc: string, 
    hours: number,
    category: string
}

routes.post('/subject', async (req, res) => {           
    try{      
        const newsubject : Subject = {
            name: req.body['name'],
            nrc: req.body['nrc'],
            hours: req.body['hours'],
            category: req.body['category'],
        }
        const subjectAdded = await firebaseHelper.firestore
                            .createNewDocument(db, collection, newsubject);
        res.status(201).send(`Subject was added to collection with id ${subjectAdded.id}`);
    }
    catch(err){
        res.status(400).send(`An error has ocurred ${err}`)
    }
});

routes.patch('/subject/:id', async(req, res) => {
    try{   
        let id = req.params.id;
        const Subject : Subject = {
            name: req.body['name'],
            nrc: req.body['nrc'],
            hours: req.body['hours'],
            category: req.body['category'],
        };
        await firebaseHelper.firestore.updateDocument(db, 
            collection, id, Subject);
        res.status(200).send(`subject with id ${id} was updated`);
    }
    catch(err){
        res.status(400).send(`An error has ocurred ${err}`);
    }
});

routes.get('/subject/:id', async(req, res) => {
    let varId = req.params.id;
    try{
        const docObtained = await firebaseHelper.firestore.getDocument(db, collection, varId);
            res.status(201).send(docObtained);
    }catch(err){
        res.status(400).send(`An error has ocurred ${err}`)
    }
});

routes.get('/subject', (req, res) =>{     
    firebaseHelper.firestore.backup(db, collection)
        .then(result => res.status(200).send(result))
        .catch(err => res.status(400).send(`An error has ocurred ${err}`));
});

routes.delete('/subject/:id', async (request, response) => {
    let id = request.params.id;
    try{        
        const docDeleted = await firebaseHelper.firestore.deleteDocument(db, 
            collection, id);
        response.status(200).send(`Subject with ${docDeleted} was deleted`);
    }
    catch(err){
        response.status(400).send(`An error has ocurred ${err}`);
    }
});