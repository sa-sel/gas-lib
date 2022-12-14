import { DialogMessage, DialogTitle, GS } from '@lib/constants';
import { DialogModel } from '@lib/models';

/** Prompt use for YES/NO confirmatin and run a function if YES. */
export const confirm = (dialog: DialogModel, fn: () => void) => {
  const response = GS.ssui.prompt(dialog.title, dialog.body, GS.ssui.ButtonSet.YES_NO);

  switch (response.getSelectedButton()) {
    case GS.ssui.Button.YES: {
      fn();
      break;
    }

    default: {
      GS.ss.toast(DialogMessage.UserCanceled, DialogTitle.Aborted);
    }
  }
};

/** Prompt user for text input. */
export const input = (
  dialog: DialogModel,
  validate = (userInput: string) => !!userInput,
  validationErrorMsg = (userInput: string) => `O input "${userInput}" é inválido.`,
): string | null => {
  let response: GoogleAppsScript.Base.PromptResponse;
  let inputValue: string;
  const body = () => dialog.body + (inputValue === undefined ? '' : `\n\n${validationErrorMsg(inputValue)}`);

  do {
    response = GS.ssui.prompt(dialog.title, body(), GS.ssui.ButtonSet.OK_CANCEL);

    if (response.getSelectedButton() === GS.ssui.Button.CANCEL) {
      GS.ss.toast(DialogMessage.UserCanceled, DialogTitle.Aborted);

      return null;
    }
  } while (!validate((inputValue = response.getResponseText())));

  return inputValue;
};
