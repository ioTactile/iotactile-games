import { initializeApp, getApps } from 'firebase-admin/app';
if (!getApps().length) initializeApp();

export { addAdmin } from './addAdmin.js';
export { removeAdmin } from './removeAdmin.js';

export { onDiceSessionEnd } from './onDiceSessionEnd.js';

export { deleteExpiredSessions } from './deleteExpiredSessions.js';
