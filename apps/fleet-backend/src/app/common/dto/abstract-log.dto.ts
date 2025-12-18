import { ApiProperty } from '@nestjs/swagger';
import { AbstractDto } from './abstract.dto';

export abstract class AbstractLogDto extends AbstractDto {
  @ApiProperty({ description: 'Timestamp of the log', type: String })
  timestamp!: string;

  @ApiProperty({ description: 'Severity' })
  severity!: 'INFO' | 'WARN' | 'ERROR';

  @ApiProperty({ description: 'Numeric code' })
  code!: number;

  @ApiProperty({ description: 'Message' })
  message!: string;
}
