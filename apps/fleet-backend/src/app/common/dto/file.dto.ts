import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from './base.dto';

export class FileDto extends BaseDto {
  @ApiProperty()
  filename!: string;

  @ApiProperty()
  url!: string;

  @ApiProperty()
  mimeType!: string;

  @ApiProperty()
  size!: number;
}
