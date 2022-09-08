import { DialogMessage, DialogTitle, GS } from '@lib/constants';
import { DialogModel } from '@lib/models';

export const confirm = (dialog: DialogModel, fn: () => void) => {
  const ui = GS.ui();
  const response = ui.prompt(dialog.title, dialog.body, ui.ButtonSet.YES_NO);

  switch (response.getSelectedButton()) {
    case ui.Button.YES: {
      fn();
      break;
    }

    default: {
      GS.ss.toast(DialogMessage.UserCanceled, DialogTitle.Aborted);
    }
  }
};
