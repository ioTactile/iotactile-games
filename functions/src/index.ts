import {initializeApp, getApps} from "firebase-admin/app";
if (!getApps().length) initializeApp();

// Observer functions
export {onDiceSession} from "./onDiceSession.js";
