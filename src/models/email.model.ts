export type SendEmailParams = {
  subject: string;
  target: string | string[];
  body?: string;
  htmlBody?: string;
  attachments?: GoogleAppsScript.Base.BlobSource[];

  /**
   * Object with image id as key and blob as value.
   *
   * @example <img src="cid:imageKey"/> -> { imageKey: imageBlob }
   * @see https://developers.google.com/apps-script/reference/mail/mail-app?hl=en#sendemailmessage
   */
  inlineImages?: Record<string, GoogleAppsScript.Base.BlobSource>;
};
