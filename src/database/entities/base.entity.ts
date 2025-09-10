import { BaseEntity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { IBaseModel } from '../models/base.model';

export abstract class AppBaseEntity extends BaseEntity implements IBaseModel {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({
    nullable: false,
    select: false,
    default: (): string => 'CURRENT_TIMESTAMP',
    type: 'timestamp without time zone',
  })
  public createAt!: Date;
}
