import { ApiProperty } from '@nestjs/swagger';

export class ColorStatsDto {
  @ApiProperty({ description: 'Color' })
  color: string;

  @ApiProperty({ description: 'Total count of logs with this color' })
  count: number;

  @ApiProperty({ description: 'Number of unique vehicles affected' })
  vehicles: number;
}

export class VehicleLogsColorStatsDto {
  @ApiProperty({ description: 'Total number of logs analyzed' })
  totalLogs: number;

  @ApiProperty({ description: 'Statistics grouped by color', type: [ColorStatsDto] })
  stats: ColorStatsDto[];
}
