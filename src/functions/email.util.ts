import { SendEmailParams } from '@lib/models';

export const sendEmail = ({ subject, target, body, htmlBody, attachments, inlineImages }: SendEmailParams): void => {
  const props: GoogleAppsScript.Mail.MailAdvancedParameters = {
    to: Session.getActiveUser().getEmail(),
    subject,
    body,
    htmlBody,
    attachments,
    inlineImages,
  };

  if (!target.length) {
    return;
  } else if (typeof target === 'string' || target.length === 1) {
    props.to = target[0];
  } else {
    props.bcc = target.join(',');
  }

  MailApp.sendEmail(props);
};
