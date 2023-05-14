import {initializeApp, getApps} from "firebase-admin/app";
if (!getApps().length) initializeApp();

// Callable functions
export {createDiceScoreboardPlayer} from "./createDiceScoreboardPlayer.js";
export {sendContact} from "./sendContact.js";

// Observer functions
export {onDiceSessionEnd} from "./onDiceSessionEnd.js";
