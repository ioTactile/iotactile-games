import * as functions from "firebase-functions";
import {getFirestore, Timestamp} from "firebase-admin/firestore";
import {getAuth} from "firebase-admin/auth";

export type Data = {
  id: string;
  role: unknown;
}

export const addAdmin = functions
    .runWith({enforceAppCheck: true})
    .region("europe-west3")
    .https.onCall(async (data: Data, context) => {
      if (!context.auth) {
        throw new functions.https.HttpsError(
            "unauthenticated",
            "Une authentification est nécessaire"
        );
      }
      if (!data.role) {
        throw new functions.https.HttpsError(
            "invalid-argument",
            "Paramètres incorrect"
        );
      }

      const auth = getAuth();
      const firestore = getFirestore();

      await auth.setCustomUserClaims(data.id, data.role);

      const updateUserData = {
        role: data.role,
        updateDate: Timestamp.now(),
      };

      await firestore
          .collection("users")
          .doc(data.id)
          .update(updateUserData);
    });
