import { ApiProperty } from '@nestjs/swagger';
import { AbstractLogDto } from '../../../common/dto/abstract-log.dto';

export class VehicleLogDto extends AbstractLogDto {
  @ApiProperty({ description: 'Vehicle ID' })
  vehicleId!: number;
}
