import { ConflictException, HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create.user.dto';
import { rolesEnum } from 'src/Util/enums/rolesEnum';
import * as bcrypt from 'bcrypt';
import { RolesService } from 'src/roles/services/roles.service';
import { authPayload } from 'src/auth/auth.service';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private readonly usersRepository: Repository<User>,
        private readonly roleService: RolesService,
    ) { }

    // * In project usacase

    async findByUsername(username: string) {
        const user = await this.usersRepository.findOne({ where: { username }, relations: { profile: true, role: true } })
        if (!user) throw new HttpException("!کاربر یافت نشد", HttpStatus.NOT_FOUND)
        return user
    }

    async findByMobile(mobile: string) {
        const user = await this.usersRepository.findOne({ where: { mobile }, relations: { profile: true, role: true } })
        if (!user) throw new HttpException("!کاربر یافت نشد", HttpStatus.NOT_FOUND)
        return user
    }

    // * Rest API usecase
    async create(data: CreateUserDto): Promise<User> {
        const { mobile, username, password } = data;

        const user = await this.usersRepository.findOne({
            where: [{ mobile }, { username }],
        });

        if (user) {
            const conflictField = user.mobile === mobile ? 'شماره موبایل' : 'نام کاربری';
            throw new ConflictException(`${conflictField} قبلاً ثبت شده است.`);
        }

        try {
            const userRole = await this.roleService.findByRole(rolesEnum.USER)
            const newUser = this.usersRepository.create({
                ...data,
                password: await bcrypt.hash(password, 10),
                role: userRole
            });

            await this.usersRepository.save(newUser);
            return newUser;
        } catch (e) {
            console.error(e);
            throw new InternalServerErrorException('خطایی رخ داد!');
        }
    }

    async getProfile(userPayload: authPayload) {
        const { mobile } = userPayload
        const user = await this.usersRepository.findOne({ where: { mobile }, relations: { profile: true } })
        if (!user) throw new NotFoundException("مدیر پیدا نشد!")
        return user
    }
}

