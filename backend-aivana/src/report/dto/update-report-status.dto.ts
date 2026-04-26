import { IsEnum } from 'class-validator';
import { ReportStatus } from 'src/constants/report-status.enum';

export class UpdateReportStatusDto {
  @IsEnum(ReportStatus)
  status: ReportStatus;
}
