/* eslint-disable max-len */
import mjml2html from "mjml";
import {SESClient, SendEmailRequest, SendEmailCommand} from "@aws-sdk/client-ses";

interface Parameters {
    mail: string;
    subject: string;
    mjmlBody: string;
    text?: string;
  }

export const sendEmail = (access: { accessKeyId: string, secretAccessKey: string }, params: SendEmailRequest) => {
  const client = new SESClient({
    credentials: {
      accessKeyId: access.accessKeyId,
      secretAccessKey: access.secretAccessKey,
    },
    region: "eu-west-1",
    apiVersion: "2010-12-01",
  });
  const sendEmailCommand = new SendEmailCommand(params);
  return client.send(sendEmailCommand);
};

export const mailMjmlTemplate = async (
    access: { accessKeyId: string, secretAccessKey: string }, {
      mail,
      subject,
      mjmlBody,
      text,
    }: Parameters) => {
  const MJML_OPTIONS = {
    fonts: {
      "Open Sans": "https://fonts.googleapis.com/css?family=Open+Sans:300,400,500,700",
    },
  };

  const htmlOutput = mjml2html(
      `<mjml>
    <mj-body>
      <mj-section>
        <mj-column>
          <mj-image width="200px" src="https://imgur.com/a/dZMeExZ"></mj-image>
          <mj-divider border-color="#CCA66C"></mj-divider>
          <mj-text align="center" font-size="20px" color="#333" font-family="Open Sans">${subject}</mj-text>
        </mj-column>
      </mj-section>

      ${mjmlBody}

    </mj-body>
  </mjml>`
      , MJML_OPTIONS);

  const params = {
    Destination: {
      BccAddresses: [],
      CcAddresses: [],
      ToAddresses: [mail],
    },
    Message: {
      Body: {
        Html: {Data: htmlOutput.html},
        Text: {
          Charset: "UTF-8",
          Data: text || "",
        },
      },
      Subject: {Data: subject},
    },
    Source: "\"iotactile Games\" <noreply@iotactile.games>",
    ReplyToAddresses: ["jbs.io@protonmail.com"],
    Tags: [],
  };
  return await sendEmail(access, params);
};
