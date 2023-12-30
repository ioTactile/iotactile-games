import { initializeApp, getApps } from "firebase-admin/app";
if (!getApps().length) initializeApp();

// Callable functions
export { addAdmin } from "./addAdmin.js";
export { removeAdmin } from "./removeAdmin.js";

// Observer functions
export { onDiceSessionEnd } from "./onDiceSessionEnd.js";

// PubSub functions
export { deleteExpiredSessions } from "./deleteExpiredSessions.js";
