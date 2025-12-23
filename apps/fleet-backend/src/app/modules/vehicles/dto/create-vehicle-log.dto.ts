import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { LogSeverity } from '../../../common/entities/log.entity';

export class CreateVehicleLogDto {
  @ApiProperty({ description: 'Log timestamp', example: '2024-01-15T10:30:00Z', type: String })
  @IsDate()
  timestamp!: Date;

  @ApiProperty({ description: 'Log severity level', example: 'ERROR', enum: LogSeverity })
  @IsString()
  @IsNotEmpty()
  @IsEnum([
    'DEBUG',
    'INFO',
    'WARN',
    'ERROR',
    'CRITICAL',
  ])
  severity!: LogSeverity;

  @ApiProperty({ description: 'Error or event code', example: 1001 })
  @IsString()
  @IsNotEmpty()
  code!: string;

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
