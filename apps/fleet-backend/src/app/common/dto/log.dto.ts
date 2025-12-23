import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from './base.dto';

export class LogDto extends BaseDto {
  @ApiProperty({ description: 'Timestamp of the log', type: String })
  timestamp!: string;

  @ApiProperty({ description: 'Severity' })
  severity!: string;

  @ApiProperty({ description: 'Text code' })
  code!: string;

  @ApiProperty({ description: 'Message' })
  message!: string;
}
