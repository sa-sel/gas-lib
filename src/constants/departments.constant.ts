export const enum SaDepartment {
  Academic = 'Atividades Acadêmicas',
  Administrative = 'Administrativo',
  Presidency = 'Presidência',
  VicePresidency = 'Vice-Presidência',
  Secretary = 'Secretaria',
  Communications = 'Comunicação',
  Events = 'Eventos',
  Extension = 'Extensão',
  HR = 'RH & Qualidade',
  Products = 'Produtos',
  Technology = 'Tecnologia',
  Treasury = 'Finanças',
}

export const SaDepartmentAbbreviations: Partial<Record<SaDepartment, string>> = {
  [SaDepartment.Academic]: 'AA',
  [SaDepartment.HR]: 'RH',
} as const;
