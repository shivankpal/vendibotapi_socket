
import { Injectable } from '@nestjs/common';
import { UsersEntity } from './users.entity';


@Injectable()
export class UsersService {
    async findOne(username: string): Promise<UsersEntity | undefined> {
        return await UsersEntity.findOne({ username: username })
    }
}