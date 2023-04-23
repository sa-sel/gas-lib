import { SheetLogger } from '@lib/classes';
import { DialogMessage, DialogTitle, GS } from '@lib/constants';
import { DialogModel } from '@lib/models';

/** Prompt use for YES/NO confirmatin and run a function if YES. */
export const confirm = (dialog: DialogModel, fn: () => void, logger?: SheetLogger) => {
  const response = GS.ui.alert(dialog.title, dialog.body, GS.ui.ButtonSet.YES_NO);

  switch (response) {
    case GS.ui.Button.YES: {
      fn();
      break;
    }

    default: {
      logger ? logger.aborted(DialogMessage.UserCanceled) : GS.ss?.toast(DialogMessage.UserCanceled, DialogTitle.Aborted);
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
    response = GS.ui.prompt(dialog.title, body(), GS.ui.ButtonSet.OK_CANCEL);

    if (response.getSelectedButton() === GS.ui.Button.CANCEL) {
      GS.ss?.toast(DialogMessage.UserCanceled, DialogTitle.Aborted);

      return null;
    }
  } while (!validate((inputValue = response.getResponseText())));

  return inputValue;
};

/** Alert user with an OK button. */
export const alert = (dialog: DialogModel): void => {
  GS.ui.alert(dialog.title, dialog.body, GS.ui.ButtonSet.OK);
};
