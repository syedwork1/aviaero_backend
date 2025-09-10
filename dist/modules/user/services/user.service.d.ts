import { Repository } from 'typeorm';
import { UserEntity } from '../../../database/entities/user.entity';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';
import { UpdateResult } from 'typeorm/query-builder/result/UpdateResult';
export declare class UserService {
    private readonly userRepository;
    constructor(userRepository: Repository<UserEntity>);
    createUser(user: Partial<UserEntity>): Promise<UserEntity>;
    deleteUser(userId: string): Promise<void>;
    findOne(where: FindOptionsWhere<UserEntity>): Promise<UserEntity>;
    findOneOptional(where: FindOptionsWhere<UserEntity>): Promise<UserEntity | null>;
    getAll(where?: FindOptionsWhere<UserEntity>, select?: Array<string>): Promise<UserEntity[]>;
    update(criteria: FindOptionsWhere<UserEntity>, user: Partial<UserEntity>): Promise<UpdateResult>;
}
