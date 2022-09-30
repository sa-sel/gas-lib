export const enum CourseEmphasis {
  Automation = 'Automação',
  Electronics = 'Eletrônica',
}

export type StudentBasicModel = {
  name: string;
  nickname?: string;
  nUsp: string;
};

export type StudentDataModel = StudentBasicModel &
  Partial<{
    phone: string;
    emphasis: CourseEmphasis;
    email: string;
    birthday: Date;
  }>;
