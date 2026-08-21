import { SESClient, SendTemplatedEmailCommand } from '@aws-sdk/client-ses';

const awsConfig = {
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
};

const emailSenderTemplate = (email, data, templateName, cb) => {
  const ses = new SESClient(awsConfig);

  const command = new SendTemplatedEmailCommand({
    Source: process.env.AWS_SES_FROM_EMAIL,
    Destination: {
      ToAddresses: [email],
    },
    Template: templateName,
    TemplateData: JSON.stringify(data),
  });

  ses
    .send(command)
    .then((result) => {
      console.log('Email sent successfully:', result);
      cb(null, result);
    })
    .catch((err) => {
      console.error('Error sending email:', err);
      cb(err, null);
    });
};

const emailServices = {
  emailSenderTemplate,
};

export default emailServices;
