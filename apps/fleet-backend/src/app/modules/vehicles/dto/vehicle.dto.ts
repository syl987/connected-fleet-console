import { ApiProperty } from '@nestjs/swagger';
import { AbstractDto } from '../../../common/dto/abstract.dto';

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
}
