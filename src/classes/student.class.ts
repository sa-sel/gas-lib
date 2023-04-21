import { ResourceUrl } from '@lib/constants';
import { CourseEmphasis, StudentDataModel } from '@lib/models';

export class Student implements StudentDataModel {
  public readonly name: string;
  public readonly nickname?: string;
  public readonly nUsp: string;
  public readonly phone?: string;
  public readonly emphasis?: CourseEmphasis;
  public readonly email?: string;
  public readonly birthday?: Date;

  constructor({ name, nickname, nUsp, phone, emphasis, email, birthday }: StudentDataModel) {
    this.name = name;
    this.nickname = nickname;
    this.nUsp = nUsp;
    this.phone = phone;
    this.emphasis = emphasis;
    this.email = email;
    this.birthday = birthday;
  }

  toString(): string {
    return `${this.name} ${this.nickname ? '(' + this.nickname + ')' : ''}`.trim();
  }

  toHtmlLi(): string {
    return (
      `<li>
        <a href="mailto:${this.email}" target="_blank">${this.toString()}</a>` +
      (this.phone
        ? ` — <a href="${ResourceUrl.WhatsAppApi.replace('{{phone}}', this.phone.replace(/\D/g, ''))}" target="_blank">${this.phone}</a>`
        : '') +
      `</li>`
    );
  }
}
