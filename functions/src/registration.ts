import * as main from './index';
import * as firebaseHelper from 'firebase-functions-helper';
import * as Router from 'express';

const routes = Router();
const db = main.db;
const collection = "registrations";

interface Registration {
    date: Date,
    personid: string,
    subjectid: string,
    type: string,
    cost: number
}

interface Grade {
    datetime: Date,
    value: number,
    unit: string,
    description: string
}

//El costo de una matrícula se determina multiplicando el número de 'hours'
//de la materia por el valor constante según el tipo de matrícula 
async function getCost(type:string, sid:string){
    const subject = await firebaseHelper.firestore.getDocument(db, 'subjects', sid);
    if(type === "P"){
        return 0;
    }
    
    if(type === "S") {
        return 12.50 * subject.hours;
    }

    return 22.75 * subject.hours;
}

function getDescription(value:number){
    if(value < 14.01){
        return "Failed";
    }
    return "Approved";
}

routes.post('/registrations', async (req, res) => {           
    try{        
        
        let costValue = await getCost(req.body['type'], req.body['subjectid']);
        
        const newRegistration : Registration = {
            date: new Date(), //Obtiene la fecha del servidor
            personid: req.body['personid'],
            subjectid: req.body['subjectid'],
            type: req.body['type'],
            cost: costValue
        };      
        const regAdded = await firebaseHelper.firestore
                                .createNewDocument(db, collection, newRegistration);
        res.status(201).send(`Subject was added to collection with id ${regAdded.id}`);
    }
    catch(err){
        res.status(400).send(`An error has ocurred ${err}`)
    }
});

routes.get('/registrations/:id', (req,res)=>{    
    firebaseHelper.firestore
        .getDocument(db, collection, req.params.id)
        .then(doc => res.status(200).send(doc))
        .catch(err => res.status(400).send(`An error has ocurred ${err}`));
});

routes.patch('/registrations/:id', async(req, res) => {
    try{       
        let costValue = await getCost(req.body['type'], req.body['subjectid']);
        let id = req.params.id;
        const registration : Registration = {
            date: new Date(), //Obtiene la fecha del servidor
            personid: req.body['personid'],
            subjectid: req.body['subjectid'],
            type: req.body['type'],
            cost: costValue
        };   
        await firebaseHelper.firestore.updateDocument(db, collection, id, registration);
        res.status(200).send(`Subject with id ${id} was updated`);
    }
    catch(err){
        res.status(400).send(`An error has ocurred ${err}`);
    }
});

routes.delete('/registrations/:id', async (request, response) => {
    try{        
        let id = request.params.id;
        await firebaseHelper.firestore.deleteDocument(db, collection, id);
        response.status(200).send(`Subject document with id ${id} was deleted`);
    }
    catch(err){
        response.status(400).send(`An error has ocurred ${err}`);
    }
});

routes.get('/registrations', (req, res) =>{     
    firebaseHelper.firestore.backup(db, collection)
        .then(result => res.status(200).send(result))
        .catch(err => res.status(400).send(`An error has ocurred ${err}`));
});

routes.post('/registrations/:id/grades', (req, res) => {           
    const newGrade : Grade = {
        datetime: new Date(), 
        value: req.body['value'],            
        unit: req.body['unit'],
        description: getDescription(req.body['value'])
    };      

    let docRegistration = db.collection(collection).doc(req.params.id);

    docRegistration.collection('grades').add(newGrade).then(gradeAdded => {
        res.status(201).send(`Grade was added with id ${gradeAdded.id}`);
    }).catch(err => {
        res.status(400).send(`An error has ocurred ${err}`);
    });
});

export { routes };