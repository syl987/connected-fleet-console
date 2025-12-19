import { ApiProperty } from '@nestjs/swagger';

export abstract class AbstractDto {
  @ApiProperty({ description: 'Unique identifier' })
  id!: number;

  @ApiProperty({ description: 'Timestamp of the creation in the database', type: String })
  createdAt!: string;

  @ApiProperty({ description: 'Timestamp of the last modification in the database', type: String })
  updatedAt!: string;

  @ApiProperty({ description: 'Timestamp of deletion if soft-deleted', type: String, required: false })
  deletedAt?: string;

  @ApiProperty({ description: 'Version in the database' })
  version!: number;
}
