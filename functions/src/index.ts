import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';

//=========================CONFIG===========================//


admin.initializeApp(functions.config().firebase);

const db = admin.firestore();
db.settings({ignoreUndefinedProperties : true});

const main = express();
main.use(cors());
main.use(bodyParser.json());
main.use(bodyParser.urlencoded({extended: false}));
main.use('/api', require('./person').routes);
main.use('/api', require('./subject').routes);
main.use('/api', require('./registration').routes);

export const api = functions.https.onRequest(main);
export { db };