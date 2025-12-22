import { ApiProperty } from '@nestjs/swagger';
import { LogSeverity } from '../../../common/entities/log.entity';

export class ColorStatsDto {
  @ApiProperty({ description: 'Color' })
  color: string;

  @ApiProperty({ description: 'Total count of logs with this color' })
  count: number;

  @ApiProperty({ description: 'Number of unique vehicles affected' })
  vehicles: number;
}

export class SeverityColorStatsDto {
  @ApiProperty({ description: 'Total number of logs analyzed' })
  totalLogs: number;

  @ApiProperty({ description: 'Log severity level', enum: LogSeverity })
  severity: LogSeverity;

  @ApiProperty({ description: 'Statistics grouped by color', type: [ColorStatsDto] })
  stats: ColorStatsDto[];
}

export class VehicleLogsColorStatsDto {
  @ApiProperty({ description: 'Total number of logs analyzed' })
  totalLogs: number;

  @ApiProperty({ description: 'Statistics grouped by severity', type: [SeverityColorStatsDto] })
  stats: SeverityColorStatsDto[];
}
