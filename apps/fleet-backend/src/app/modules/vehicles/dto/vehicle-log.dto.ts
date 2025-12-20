import { ApiProperty } from '@nestjs/swagger';
import { LogDto } from '../../../common/dto/log.dto';
import { VehicleDto } from './vehicle.dto';

export class VehicleLogDto extends LogDto {
  @ApiProperty({ description: 'Vehicle ID' })
  vehicle?: VehicleDto;
}
