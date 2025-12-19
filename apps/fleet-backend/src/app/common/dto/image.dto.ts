import { ApiProperty } from '@nestjs/swagger';
import { AbstractDto } from './abstract.dto';

export class ImageDto extends AbstractDto {
  @ApiProperty()
  filename!: string;

  @ApiProperty()
  url!: string;

  @ApiProperty({ required: false })
  thumbnailUrl?: string;

  @ApiProperty()
  mimeType!: string;

  @ApiProperty()
  size!: number;
}
