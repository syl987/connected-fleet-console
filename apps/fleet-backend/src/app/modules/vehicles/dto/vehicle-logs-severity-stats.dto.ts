import { ApiProperty } from '@nestjs/swagger';

export class SeverityStatsDto {
  @ApiProperty({ description: 'Severity level' })
  severity: string;

  @ApiProperty({ description: 'Total count of logs with this severity' })
  count: number;

  @ApiProperty({ description: 'Number of unique vehicles affected' })
  vehicles: number;
}

export class VehicleLogsSeverityStatsDto {
  @ApiProperty({ description: 'Total number of logs analyzed' })
  totalLogs: number;

  @ApiProperty({ description: 'Statistics grouped by severity level', type: [SeverityStatsDto] })
  stats: SeverityStatsDto[];
}
