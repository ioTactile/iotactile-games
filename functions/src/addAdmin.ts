import { onCall, HttpsError } from "firebase-functions/v2/https";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

interface Parameters {
  id: string;
  role: unknown;
}

export const addAdmin = onCall(
  { region: "europe-west3", enforceAppCheck: true },
  async (request) => {
    if (request.app == undefined) {
      throw new HttpsError(
        "failed-precondition",
        "The function must be called from an App Check verified app.",
      );
    }
    if (!request.auth) {
      throw new HttpsError(
        "unauthenticated",
        "Une authentification est nécessaire",
      );
    }

    const data = request.data as Parameters;

    if (!data.role) {
      throw new HttpsError("invalid-argument", "Paramètres incorrect");
    }

    const auth = getAuth();
    const firestore = getFirestore();

    await auth.setCustomUserClaims(data.id, data.role);

    const updateUserData = {
      role: data.role,
      updateDate: Timestamp.now(),
    };

    await firestore.collection("users").doc(data.id).update(updateUserData);
  },
);
