import { BaseEntity } from 'typeorm';
import { IBaseModel } from '../models/base.model';
export declare abstract class AppBaseEntity extends BaseEntity implements IBaseModel {
    id: string;
    createAt: Date;
}
