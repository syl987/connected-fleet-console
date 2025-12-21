import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Max, Min } from 'class-validator';

export class GenerateVehicleLogsDto {
  @ApiProperty({ description: 'Duration in milliseconds', example: 60000, type: Number })
  @IsInt()
  @Min(1000)
  @Max(10 * 60 * 1000)
  duration!: number;

  @ApiProperty({ description: 'Interval how often to generate logs in milliseconds', example: 1000, type: Number })
  @IsInt()
  @Min(1000)
  @Max(60 * 1000)
  interval!: number;

  @ApiProperty({
    description: 'Maximum number of logs generated per interval tick for each vehicle',
    example: 5,
    type: Number,
  })
  @IsInt()
  @Min(1)
  @Max(10)
  max!: number;
}
