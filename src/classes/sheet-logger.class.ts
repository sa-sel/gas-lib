import { DialogMessage, DialogTitle, GS } from '@lib/constants';
import { appendDataToSheet } from '@lib/functions';
import { LogObject } from '@lib/models';

export class SheetLogger {
  constructor(
    public readonly feature: string,
    private readonly spreadsheet = GS.ss,
    private readonly sheet = spreadsheet.getSheetByName('Logs'),
    private readonly user = Session.getActiveUser().getEmail(),
  ) {
    if (!sheet) {
      throw new Error(`The spreadsheet "${this.spreadsheet.getName()}" does not have a 'Logs' sheet.`);
    }
  }

  log(event: string, comment?: string, toast = true) {
    toast && GS.ss.toast(comment, event);
    appendDataToSheet<LogObject>(
      [
        {
          feature: this.feature,
          user: this.user,
          timestamp: new Date().asTimestamp(),
          event,
          comment,
        },
      ],
      this.sheet,
      obj => [undefined, obj.feature, obj.user, obj.timestamp, obj.event, obj.comment, undefined],
    );
  }

  accessDenied(allowedEmails?: string[]) {
    let comment = `O usuário ${this.user} não tem permissão para executar a função "${this.feature}".`;

    if (allowedEmails?.length) {
      comment += `\nOs usuários autorizados são: ${allowedEmails.toString()}.`;
    }

    this.log(DialogTitle.AccessDenied, comment);
  }

  error(comment?: string) {
    this.log(DialogTitle.Error, comment);
  }

  aborted(comment = DialogMessage.UserCanceled) {
    this.log(DialogTitle.Aborted, comment);
  }
}
