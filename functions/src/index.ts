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
db.settings({ignoreUndefinedProperties : true});

const main = express();
main.use(bodyParser.json());
main.use(bodyParser.urlencoded({extended: false}));
main.use('/api', require('./person').routes);
main.use('/api', require('./subject').routes);
main.use('/api', require('./registration').routes);

export const api = functions.https.onRequest(main);
export { db };

export interface Message {
  title: string,
  text: string,
  icon: string
};

export function Message(title: string, text: string, icon: string){
  let message :  Message = {
    title: title,
    text: text,
    icon: icon
  }
  return message
}


