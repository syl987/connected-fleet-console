import { ApiProperty } from '@nestjs/swagger';
import { LogDto } from '../../../common/dto/log.dto';

export class VehicleLogDto extends LogDto {
  @ApiProperty({ description: 'Vehicle ID' })
  vehicleId!: number;
}
