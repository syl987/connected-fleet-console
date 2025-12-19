import { ApiProperty } from '@nestjs/swagger';
import { AbstractDto } from './abstract.dto';

export class FileDto extends AbstractDto {
  @ApiProperty()
  filename!: string;

  @ApiProperty()
  url!: string;

  @ApiProperty()
  mimeType!: string;

  @ApiProperty()
  size!: number;
}
