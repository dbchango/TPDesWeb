import * as main from './index';
import * as firebaseHelper from 'firebase-functions-helper';
import * as Router from 'express';

const routes = Router();
const db = main.db;
const collection = "subjects";

interface Subject {
    idsubject?: string,//Este atributo permite nulo 
    name: string,
    nrc: string,
    hours: number,
    category: string
}

//fucnion constructor 
function getSubject(id: string, data: any){
    let object : Subject = {
        idsubject: id, 
        name: data.name,
        nrc: data.nrc,
        hours: data.number,
        category: data.category
    }
    return object;
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
        res.status(201).json(main.Message('Materia aniadida', `La materia con el id ${SubjectAdded.id} se ha aniadido`, 'success'));
    }
    catch(err){
        res.status(400).json(main.Message('Un error ha ocurrido', `${err}`, 'error', ));
    }
});

routes.get('/subjects/:id', (req,res)=>{    
    firebaseHelper.firestore
        .getDocument(db, collection, req.params.id)
        .then(doc => res.status(200).json(getSubject(doc.id, doc)))
        .catch(err => res.status(400).json(main.Message('Un error ha ocurrido', `${err}`, 'error', )));
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
        res.status(200).json(main.Message('La materia ha sido modificada', `La meteria con el id ${id} ha sido modificada`, 'success'));
    }
    catch(err){
        res.status(400).json(main.Message('Un error ha ocurrido', `${err}`, 'error', ));
    }
});

routes.delete('/subjects/:id', async (request, response) => {
    try{        
        let id = request.params.id;
        await firebaseHelper.firestore.deleteDocument(db, collection, id);
        response.status(200).json(main.Message('La materia ha sido eliminada',`La materia con el id ${id} ha sido eliminada`,'success'));
    }
    catch(err){
        response.status(400).json(main.Message('Un error ha ocurrido', `${err}`, 'error', ));
    }
});

routes.get('/subjects', async (req, res) =>{     
    db.collection(collection).get()
    .then(snapshot=> {
        res.status(200).json(snapshot.docs.map(doc => getSubject(doc.id, doc.data())));
    }).catch(err=>res.status(400).json(main.Message('Un error ha ocurrido', `${err}`, 'error', )))
});

export { routes };