import { ConflictException, HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create.user.dto';
import { rolesEnum } from 'src/Util/enums/rolesEnum';
import * as bcrypt from 'bcrypt';
import { RolesService } from 'src/roles/services/roles.service';
import { authPayload } from 'src/auth/auth.service';
import { ProfilesService } from 'src/profiles/services/profiles.service';
import { UpdateProfileDto } from '../../profiles/dto/update.profile.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private readonly usersRepository: Repository<User>,
        private readonly roleService: RolesService,
        private readonly profilesService: ProfilesService,
    ) { }

    // * In project usacase

    async findByUsername(username: string) {
        const user = await this.usersRepository.findOne({ where: { username }, relations: { profile: true, role: true } })
        if (!user) throw new HttpException("!کاربر یافت نشد", HttpStatus.NOT_FOUND)
        return user
    }

    async findByMobile(mobile: string, relations?: object) {
        const user = await this.usersRepository.findOne({ where: { mobile }, relations: { profile: true, ...relations } })
        if (!user) throw new HttpException("!کاربر یافت نشد", HttpStatus.NOT_FOUND)
        return user
    }

    // * Rest API usecase
    async create(data: CreateUserDto) {
        const { mobile, username, password } = data;

        const user = await this.usersRepository.findOne({
            where: [
                { mobile: mobile },
                { username: username }
            ],
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
                role: userRole,
            });
            newUser.profile = await this.profilesService.createProfile({ family: null, name: null, national_code: null }, newUser)
            await this.usersRepository.save(newUser);
            return await this.findByMobile(newUser.mobile);
        } catch (e) {
            console.error(e);
            throw new InternalServerErrorException('خطایی رخ داد!');
        }
    }

    async getProfile(userPayload: authPayload) {
        const { mobile } = userPayload
        const user = await this.usersRepository.findOne({ where: { mobile }, relations: { profile: true } })
        if (!user) throw new NotFoundException("کاربر پیدا نشد!")
        return user
    }

    async updateProfile(userPayload: authPayload, updateProfileDto: UpdateProfileDto) {
        await this.profilesService.update(userPayload.sub, updateProfileDto)
        const user = this.findByMobile(userPayload.mobile)
        return user
    }
}
