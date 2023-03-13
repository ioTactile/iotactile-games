import { initializeApp, getApps } from 'firebase/app'
import { initializeFirestore } from 'firebase/firestore'
import { getFunctions } from 'firebase/functions'

const firebaseConfig = {
  apiKey: 'AIzaSyDROkpZDuHw2KvV3OgPu9P-WJbk4_4-KJc',
  authDomain: 'iotactile-games.firebaseapp.com',
  projectId: 'iotactile-games',
  storageBucket: 'iotactile-games.appspot.com',
  messagingSenderId: '863733555330',
  appId: '1:863733555330:web:5f68e24010403d7d6b949b',
  measurementId: 'G-7F7CDGDN3F',
}

export default defineNuxtPlugin(() => {
  // const config = useRuntimeConfig()
  const apps = getApps()

  let firebaseApp
  if (!apps.length) {
    firebaseApp = initializeApp(firebaseConfig)
  } else {
    firebaseApp = apps[0]
  }

  const firestore = initializeFirestore(firebaseApp, {
    ignoreUndefinedProperties: true,
  })
  const functions = getFunctions(firebaseApp, 'europe-west2')

  return {
    provide: { firestore, functions, firebaseApp },
  }
})
