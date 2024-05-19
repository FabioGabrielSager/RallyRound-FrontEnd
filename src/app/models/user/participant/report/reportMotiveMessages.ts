import {ReportMotive} from "./reportMotive";

export const ReportMotiveMessages: { [key in ReportMotive]: string } = {
  [ReportMotive.INAPPROPRIATE_BEHAVIOR]: 'Comportamiento inapropiado',
  [ReportMotive.OFFENSIVE_LANGUAGE]: 'Lenguaje ofensivo',
  [ReportMotive.INAPPROPRIATE_CONTENT]: 'Contenido inapropiado',
  [ReportMotive.IMPERSONATION]: 'Suplantación de identidad',
  [ReportMotive.ABSENTEEISM]: 'Absentismo',
  [ReportMotive.HARASSMENT]: 'Acoso',
  [ReportMotive.SPAMMING]: 'Spam',
  [ReportMotive.FRAUD]: 'Fraude',
  [ReportMotive.OTHER]: 'Otro'
};
