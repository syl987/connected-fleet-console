import { ApiProperty } from '@nestjs/swagger';

export class VehicleLogsSummaryDto {
  @ApiProperty({ description: 'Total number of vehicle logs' })
  totalLogs: number;

  @ApiProperty({ description: 'Earliest vehicle log date' })
  earliestDate: string;

  @ApiProperty({ description: 'Latest vehicle log date' })
  latestDate: string;

  @ApiProperty({ description: 'Highest vehicle mileage recorded in logs' })
  highestMileage: string;

  /* @ApiProperty({ description: '' })
  latestYear: string; */
}
