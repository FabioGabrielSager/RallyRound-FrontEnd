export interface ReportsCountByMotiveAndYearAndMonth {
  month: number;
  year: number;
  inappropriateBehaviorReportsCount: number;
  spammingReportsCount: number;
  harassmentReportCounts: number;
  offensiveLanguageReportCounts: number;
  fraudReportCounts: number;
  impersonationReportCounts: number;
  inappropriateContentReportCounts: number;
  absenteeismReportCounts: number;
  otherMotivesReportCounts: number;
}
