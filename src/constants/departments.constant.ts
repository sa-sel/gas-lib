export const enum SaDepartment {
  Academic = 'Atividades Acadêmicas',
  Administrative = 'Administrativo',
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
