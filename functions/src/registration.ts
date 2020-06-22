import * as main from './index';
import * as firebaseHelper from 'firebase-functions-helper';
import * as Router from 'express';

const routes = Router();
const db = main.db;
const collection = "registrations"

interface Registration {
    date: Date,
    personid: string, 
    subjectid: number,
    category: string,
    type: string, 
    cost: number
}


interface Grade{
    datetime: Date, 
    value: number,
    unit: string,
    description: string
}


//El costo de una matricula se determina multiplicando el numero de horas
//de la materia por el valor constante segun el tipo de matricula
async function getCost(type:string, sid:string){
    const subject =  await firebaseHelper.firestore.getDocument(db, 'subjects', sid)
    if(type==="P"){
        return 0;
    }
    if(type==="s"){
        return 12.50 * subject.hours;
    }
    return 22.75 * subject.hours;
};

function getDescription(value:number){
    if(value < 14.01){
        return "Failed";
    }
    return "Approved";
}

routes.post('/registration', async (req, res) => {           
    try{      
        let costValue = await getCost(req.body['type'], req.body['subjectid']);
        const newRegistration : Registration = {
            date: new Date(),//Definiendo la fecha del servidor 
            personid: req.body['personid'],
            subjectid: req.body['subjectid'],
            category: req.body['category'],
            type: req.body['type'],
            cost: costValue

        }
        const registerAdded = await firebaseHelper.firestore
                            .createNewDocument(db, collection, newRegistration);
        res.status(201).send(`Subject was added to collection with id ${registerAdded.id}`);
    }
    catch(err){
        res.status(400).send(`An error has ocurred ${err}`)
    }
});

routes.patch('/registration/:id', async(req, res) => {
    try{   
        let costValue = await getCost(req.body['type'], req.body['subjectid']);
        let id = req.params.id;
        const Registration : Registration = {
            date: new Date(),//Definiendo la fecha del servidor 
            personid: req.body['personid'],
            subjectid: req.body['subjectid'],
            category: req.body['category'],
            type: req.body['type'],
            cost: costValue
        };
        await firebaseHelper.firestore.updateDocument(db, 
            collection, id, Registration);
        res.status(200).send(`subject with id ${id} was updated`);
    }
    catch(err){
        res.status(400).send(`An error has ocurred ${err}`);
    }
});

routes.get('/registration/:id', async(req, res) => {
    let varId = req.params.id;
    try{
        const docObtained = await firebaseHelper.firestore.getDocument(db, collection, varId);
            res.status(201).send(docObtained);
    }catch(err){
        res.status(400).send(`An error has ocurred ${err}`)
    }
});

routes.get('/registration', (req, res) =>{     
    firebaseHelper.firestore.backup(db, collection)
        .then(result => res.status(200).send(result))
        .catch(err => res.status(400).send(`An error has ocurred ${err}`));
});

routes.delete('/registration/:id', async (request, response) => {
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

routes.post('/registration/:id/grade', async (req, res) => {           
     
        let id = req.params.id;
        const newGrade : Grade = {
            datetime: new Date(),//Definiendo la fecha del servidor 
            value: req.body['personid'],
            unit: req.body['subjectid'],
            description: getDescription(req.body['value'])

        };
        let docReg = db.collection(collection).doc(id);
        docReg.collection('grades').add(newGrade).then(gradeAdded => {
            res.status(201).send(`Subject was added to collection with id ${gradeAdded.id}`);
        }).catch(err => {
            res.status(400).send(`An error has ocurred ${err}`);
        });
    
});