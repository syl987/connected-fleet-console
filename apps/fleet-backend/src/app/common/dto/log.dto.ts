import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from './base.dto';

export class LogDto extends BaseDto {
  @ApiProperty({ description: 'Timestamp of the log', type: String })
  timestamp!: string;

  @ApiProperty({ description: 'Severity' })
  severity!: string;

  @ApiProperty({ description: 'Numeric code' })
  code!: number;

  @ApiProperty({ description: 'Message' })
  message!: string;
}
