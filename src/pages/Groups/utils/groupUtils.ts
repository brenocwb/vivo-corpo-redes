
export const getDayName = (day?: string): string => {
  if (!day) return 'Não definido';
  const days: Record<string, string> = {
    'domingo': 'Domingo',
    'segunda': 'Segunda-feira',
    'terca': 'Terça-feira',
    'quarta': 'Quarta-feira',
    'quinta': 'Quinta-feira',
    'sexta': 'Sexta-feira',
    'sabado': 'Sábado'
  };
  return days[day.toLowerCase()] || day;
};
