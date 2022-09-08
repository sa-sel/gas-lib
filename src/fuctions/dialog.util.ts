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

export const input = (
  dialog: DialogModel,
  validate = (userInput: string) => !!userInput,
  validationErrorMsg = (userInput: string) => `O input "${userInput}" é inválido.`,
): string | null => {
  let response: GoogleAppsScript.Base.PromptResponse;
  let inputValue: string;
  const body = () => dialog.body + (inputValue === undefined ? '' : `\n\n${validationErrorMsg(inputValue)}`);
  const ui = GS.ui();

  do {
    response = ui.prompt(dialog.title, body(), ui.ButtonSet.OK_CANCEL);

    if (response.getSelectedButton() === ui.Button.CANCEL) {
      GS.ss.toast(DialogMessage.UserCanceled, DialogTitle.Aborted);

      return null;
    }
  } while (!validate((inputValue = response.getResponseText())));

  return inputValue;
};
