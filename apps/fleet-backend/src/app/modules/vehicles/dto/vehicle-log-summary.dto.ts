import { ApiProperty } from '@nestjs/swagger';

export class VehicleLogDto {
  @ApiProperty({ description: '' })
  totalLogs: number;

  @ApiProperty({ description: '' })
  uniqueVehicles: number;

  @ApiProperty({ description: '' })
  uniqueCodes: number;

  @ApiProperty({ description: '' })
  earliestDate: string;

  @ApiProperty({ description: '' })
  latestDate: string;
}
