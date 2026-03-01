import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tags')
export class Tag {
  @ApiProperty({ example: 1, description: 'The unique identifier of the tag' })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty({ example: 'Nature', description: 'The name of the tag' })
  @Column('varchar', { length: 255, nullable: false })
  @Index('UQ_tag_name', { unique: true })
  name: string;
}
