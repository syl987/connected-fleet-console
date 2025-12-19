import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '../../../common/dto/base.dto';
import { FuelType } from '../entities/vehicle.entity';
import { VehicleLogDto } from './vehicle-log.dto';

export class VehicleDto extends BaseDto {
  @ApiProperty()
  brand!: string;

  @ApiProperty()
  model!: string;

  @ApiProperty()
  year!: number;

  @ApiProperty()
  vin!: string;

  @ApiProperty()
  mileage!: number;

  @ApiProperty({ required: false })
  color?: string;

  @ApiProperty({ enum: FuelType })
  fuelType!: FuelType;

  @ApiProperty({ type: [VehicleLogDto] })
  logs!: VehicleLogDto[];
}
