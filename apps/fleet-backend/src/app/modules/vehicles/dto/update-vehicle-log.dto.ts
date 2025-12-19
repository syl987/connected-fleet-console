import { PartialType } from '@nestjs/swagger';
import { CreateVehicleLogDto } from './create-vehicle-log.dto';

export class UpdateVehicleLogDto extends PartialType(CreateVehicleLogDto) {}
