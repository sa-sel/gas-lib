import { DialogTitle, GS } from '@lib/constants';
import { SheetLogger } from './sheet-logger.class';

export class Authorizer {
  public readonly user: string;

  constructor(public readonly allowedEmails: string[], private readonly logger?: SheetLogger) {
    this.user = Session.getActiveUser().getEmail();
  }

  /** Does the current user have access? */
  get ok(): boolean {
    return this.allowedEmails.some(allowed => allowed === this.user);
  }

  authenticate() {
    if (this.ok) {
      return;
    }

    this.logger
      ? this.logger.accessDenied(this.allowedEmails)
      : GS.ss?.toast(`O usuário ${this.user} não tem permissão para acessar este recurso.`, DialogTitle.AccessDenied);

    throw new Error(
      `Access denied for user ${this.user} (resource ${
        this.logger?.feature ?? 'not specified'
      }).\nAllowed: ${this.allowedEmails.toLocaleString()}.`,
    );
  }
}
