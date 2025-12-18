import { ApiProperty } from '@nestjs/swagger';

export abstract class AbstractLogDto {
  @ApiProperty({ description: 'Unique identifier' })
  id!: number;

  @ApiProperty({ description: 'Timestamp of the log', type: String })
  timestamp!: string;

  @ApiProperty({ description: 'Severity' })
  severity!: 'INFO' | 'WARN' | 'ERROR';

  @ApiProperty({ description: 'Numeric code' })
  code!: number;

  @ApiProperty({ description: 'Message' })
  message!: string;
}
