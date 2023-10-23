import { initializeApp, getApps } from 'firebase-admin/app'
if (!getApps().length) initializeApp()

// Callable functions
export { sendContact } from './sendContact.js'
export { addAdmin } from './addAdmin.js'
export { removeAdmin } from './removeAdmin.js'

// Observer functions
export { onDiceSessionEnd } from './onDiceSessionEnd.js'
export { onLinguaVaultSessionRematch } from './onLinguaVaultSessionRematch.js'

// PubSub functions
export { deleteExpiredSessions } from './deleteExpiredSessions.js'
