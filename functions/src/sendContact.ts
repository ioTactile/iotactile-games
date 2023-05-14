import * as functions from "firebase-functions";
import {defineSecret} from "firebase-functions/params";
import {mailMjmlTemplate} from "./utils.js";

const awsAccessKeyId = defineSecret("AWS_ACCESS_KEY_ID");
const awsSecretAccessKey = defineSecret("AWS_SECRET_ACCESS_KEY");

export const sendContact = functions
    .runWith({secrets: [awsAccessKeyId, awsSecretAccessKey]})
    .region("europe-west3").https
    .onCall(async (data) => {
      if (typeof data.sender !== "string" ||
            typeof data.subject !== "string" ||
          typeof data.text !== "string") {
        throw new functions.https
            .HttpsError("invalid-argument", "Paramètres incorrect");
      }

      await mailMjmlTemplate({
        accessKeyId: awsAccessKeyId.value(),
        secretAccessKey: awsSecretAccessKey.value(),
      }, {
        mail: "jbs.io@protonmail.com",
        subject: data.subject,
        mjmlBody: data.text,
      });

      return;
    });
