import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateVehicleDto {
  @ApiProperty({ description: 'Vehicle brand', example: 'Toyota' })
  @IsString()
  @IsNotEmpty()
  brand!: string;

  @ApiProperty({ description: 'Vehicle model', example: 'Corolla' })
  @IsString()
  @IsNotEmpty()
  model!: string;

  @ApiProperty({ description: 'Year of manufacture', example: 2020 })
  @Type(() => Number)
  @IsInt()
  @Min(1886)
  year!: number;

  @ApiProperty({ description: 'Vehicle Identification Number', example: '1HGCM82633A004352' })
  @IsString()
  @IsNotEmpty()
  vin!: string;

  @ApiProperty({ description: 'Mileage in km', required: false, example: 12345 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  mileage?: number;
}
