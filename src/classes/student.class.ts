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
    this.name = name.trim();
    this.nickname = nickname?.trim();
    this.nUsp = nUsp.trim();
    this.phone = phone?.trim();
    this.emphasis = emphasis;
    this.email = email?.trim();
    this.birthday = birthday;
  }

  static fromNameNicknameString(nameNickname: string, args: Omit<StudentDataModel, 'name' | 'nickname'>): Student {
    const [name, nickname] = nameNickname.split(/(.+?)\((.+?)\)/).filter(e => e);

    return new this({
      name,
      nickname,
      ...args,
    });
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
