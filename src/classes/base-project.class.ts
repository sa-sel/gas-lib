import { ProjectVariable, SaDepartment } from '@lib/constants';
import { Folder } from '@lib/models';
import { Student } from './student.class';

export abstract class BaseProject {
  private static defaultEdition = `${new Date().getFullYear()}.${new Date().getMonth() > 5 ? 2 : 1}`;

  edition: string;
  manager: Student;
  director: Student;
  members: Student[];
  folder: Folder;

  readonly fullDepartmentName: string;

  constructor(public readonly name: string, public readonly department: SaDepartment, public readonly start = new Date()) {
    this.edition = BaseProject.defaultEdition;
    this.members = [];
    this.fullDepartmentName = this.department === SaDepartment.Administrative ? this.department : `Diretoria de ${this.department}`;
  }

  setManager(manager?: Student): this {
    if (manager) {
      this.manager = manager;
    }

    return this;
  }

  setDirector(director?: Student): this {
    if (director) {
      this.director = director;
    }

    return this;
  }

  setEdition(edition?: string): this {
    if (edition) {
      this.edition = edition.trim();
    }

    return this;
  }

  setMembers(members?: Student[]): this {
    if (members) {
      this.manager && !members.some(m => m.nUsp === this.manager.nUsp) && members.push(this.manager);
      this.director && !members.some(m => m.nUsp === this.director.nUsp) && members.push(this.director);
      this.members = members;
    }

    return this;
  }

  toString(): string {
    return `${this.name} (${this.edition})`;
  }

  protected processStringTemplate(str: string, templateVariables = this.templateVariables): string {
    return Object.entries(templateVariables).reduce((result, [variable, value]) => result.replaceAll(variable, value), str);
  }

  protected get templateVariables(): Record<ProjectVariable, string> {
    return {
      [ProjectVariable.Department]: this.department || ProjectVariable.Department,
      [ProjectVariable.FullDepartment]: this.fullDepartmentName || ProjectVariable.FullDepartment,
      [ProjectVariable.Edition]: this.edition,
      [ProjectVariable.Manager]: this.manager ? this.manager.toString() : ProjectVariable.Manager,
      [ProjectVariable.Director]: this.director ? this.director.toString() : ProjectVariable.Director,
      [ProjectVariable.ManagerEmail]: this.manager?.email || ProjectVariable.ManagerEmail,
      [ProjectVariable.DirectorEmail]: this.director?.email || ProjectVariable.DirectorEmail,
      [ProjectVariable.Name]: this.name,
      [ProjectVariable.Start]: this.start.asDateString(),
      [ProjectVariable.NumMembers]: this.members.length.toString() || ProjectVariable.NumMembers,
      [ProjectVariable.Members]: this.members.reduce((acc, cur) => `${acc}• ${cur.toString()}\n`, '') || ProjectVariable.Members,
      [ProjectVariable.MembersHtmlList]: this.members.reduce((a, c) => `${a}${c.toHtmlLi()}\n`, '') || ProjectVariable.MembersHtmlList,
      [ProjectVariable.FolderUrl]: this.folder?.getUrl() || ProjectVariable.FolderUrl,
    };
  }
}
