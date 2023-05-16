import {initializeApp, getApps} from "firebase-admin/app";
if (!getApps().length) initializeApp();

// Callable functions
export {sendContact} from "./sendContact.js";

// Observer functions
export {onDiceSessionEnd} from "./onDiceSessionEnd.js";

// PubSub functions
export {deleteExpiredDiceSession} from "./deleteExpiredDiceSession.js";
