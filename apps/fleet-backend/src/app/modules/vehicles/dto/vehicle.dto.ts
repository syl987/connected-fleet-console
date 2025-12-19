import { ApiProperty } from '@nestjs/swagger';
import { AbstractDto } from '../../../common/dto/abstract.dto';
import { FuelType } from '../entities/vehicle.entity';

export class VehicleDto extends AbstractDto {
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
}
