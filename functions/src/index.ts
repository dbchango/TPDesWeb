import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';
import * as bodyParser from 'body-parser';

//=========================CONFIG===========================//

admin.initializeApp({
    credential: admin.credential.cert(require("../../serviceAccountKey.json")),
    databaseURL: "https://nrc-7828-4ad7b.firebaseio.com"
  });

const db = admin.firestore();
db.settings({ignoreUndefinedProperties:true});
const main = express();
main.use(bodyParser.json());
main.use(bodyParser.urlencoded({extended: false}));
main.use('/api', require('./person').routes);

export const api = functions.https.onRequest(main);
export { db };//exportacion de la base de datos 