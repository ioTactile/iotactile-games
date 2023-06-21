import * as functions from "firebase-functions";
import {FieldValue, getFirestore} from "firebase-admin/firestore";
import {getAuth} from "firebase-admin/auth";

export type Data = {
  id: string
}

export const removeAdmin = functions
    .runWith({enforceAppCheck: true})
    .region("europe-west3")
    .https.onCall(async (data: Data, context) => {
      if (!context.auth) {
        throw new functions.https.HttpsError(
            "unauthenticated",
            "Une authentification est nécessaire"
        );
      }
      if (!data.id) {
        throw new functions.https.HttpsError(
            "invalid-argument",
            "Paramètres incorrect"
        );
      }

      const auth = getAuth();
      const firestore = getFirestore();

      await auth.setCustomUserClaims(data.id, {
        admin: false,
      });

      await firestore.collection("users").doc(data.id).update({
        role: FieldValue.delete(),
      });
    });
