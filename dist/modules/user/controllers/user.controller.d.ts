import { UserService } from '../services/user.service';
import { UserCreateDto } from '../dtos/userCreate.dto';
import { UserEntity } from '../../../database/entities/user.entity';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    createUser(userDto: UserCreateDto): Promise<Partial<UserEntity>>;
    deleteUser(id: string, req: any): Promise<void>;
    getUser(): Promise<UserEntity[]>;
}
