import { DialogTitle, ss, ui } from '@lib/constants';
import { DialogModel } from '@lib/models';

export const confirm = (fn: () => void, dialog: DialogModel = { title: 'Tem certeza que deseja continuar?', body: '' }) => {
  const response = ui.prompt(dialog.title, dialog.body, ui.ButtonSet.YES_NO);

  switch (response.getSelectedButton()) {
    case ui.Button.YES: {
      fn();
      break;
    }

    default: {
      ss.toast('A operação cancelada pelo usuário.', DialogTitle.Aborted);
    }
  }
};
