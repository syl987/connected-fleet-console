import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateVehicleLogDto {
  @ApiProperty({ description: 'Log timestamp', example: '2024-01-15T10:30:00Z', type: String })
  @IsDateString()
  @IsNotEmpty()
  timestamp!: Date;

  @ApiProperty({ description: 'Log severity level', example: 'ERROR' })
  @IsString()
  @IsNotEmpty()
  severity!: string;

  @ApiProperty({ description: 'Error or event code', example: 1001 })
  @Type(() => Number)
  @IsInt()
  code!: number;

  @ApiProperty({ description: 'Log message', example: 'Engine temperature warning' })
  @IsString()
  @IsNotEmpty()
  message!: string;

  @ApiProperty({ description: 'Vehicle ID', example: 1 })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  vehicleId!: number;
}
