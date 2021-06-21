import * as functions from "firebase-functions";
import firebase from 'firebase/app';
import 'firebase/firestore';
import { config } from "./constants";
import { Congregation } from "./models/congregation";
import { AddProgramData } from "./models/wol";
import { sendEmail } from "./services/email";
import { ProgramsService } from "./services/programs";

const _firebase: firebase.app.App = firebase.initializeApp(config);


// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const addProgram = functions.https.onCall((data: AddProgramData, context)=> {
   // _firebase.auth().signInAnonymously();
    const programService = new ProgramsService();
    functions.logger.log("DATA FROM CALLABLE:", data);
    let date: Date = new Date(data.date);
    let congregation: Congregation = data.congregation;
    return programService.addProgram(date, congregation, _firebase.firestore())
});

export const emailData = functions.https.onCall((req, context) => {
  try {
        var data = req;
        sendEmail(data)
  } catch(error) {
      console.log(error)
  }
})