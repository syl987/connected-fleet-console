import { ApiProperty } from '@nestjs/swagger';
import { FileDto } from '../../../common/dto/file.dto';

export class ImageDto extends FileDto {
  @ApiProperty({ required: false })
  thumbnailUrl?: string;
}
