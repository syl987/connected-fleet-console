import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from './base.dto';

export class LogDto extends BaseDto {
  @ApiProperty({ description: 'Timestamp of the log', type: String })
  timestamp!: string;

  @ApiProperty({ description: 'Severity' })
  severity!: 'INFO' | 'WARN' | 'ERROR';

  @ApiProperty({ description: 'Numeric code' })
  code!: number;

  @ApiProperty({ description: 'Message' })
  message!: string;
}
