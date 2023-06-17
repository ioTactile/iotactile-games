import * as functions from "firebase-functions";
import nodemailer from "nodemailer";

interface Parameters {
  sender: string,
  subject: string,
  text: string,
}

export const sendContact = functions
    .runWith({enforceAppCheck: true})
    .region("europe-west3").https
    .onCall(async (data: Parameters, context) => {
      if (context.app == undefined) {
        throw new functions.https.HttpsError(
            "failed-precondition",
            "The function must be called from an App Check verified app.");
      }
      if (typeof data.sender !== "string" ||
          typeof data.subject !== "string" ||
          typeof data.text !== "string") {
        throw new functions.https
            .HttpsError("invalid-argument", "Paramètres incorrect");
      }

      functions.logger.log(data);

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.NODEMAILER_USER,
          pass: process.env.NODEMAILER_PASSWORD,
        },
      });

      const mailOptions = {
        from: process.env.NODEMAILER_USER,
        to: data.sender,
        subject: data.subject,
        text: data.text,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          functions.logger.error(error);
        } else {
          functions.logger.log("Email envoyé: " + info.response);
        }
      });

      return;
    });
