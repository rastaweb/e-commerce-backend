import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { rainbow, yellow, } from 'colors';
import { UsersService } from './users.service';
import { RolesService } from 'src/roles/services/roles.service';
import { rolesEnum } from 'src/Util/enums/rolesEnum';
import { authPayload } from 'src/auth/auth.service';
import { UpdateProfileDto } from 'src/profiles/dto/update.profile.dto';
import { ProfilesService } from 'src/profiles/services/profiles.service';
@Injectable()
export class UsersAdminService {
    constructor(
        @InjectRepository(User) private readonly usersRepository: Repository<User>,
        private readonly usersService: UsersService,
        private readonly rolesService: RolesService,
        private readonly profilesService: ProfilesService,
    ) { }

    async findAll(page: number, limit: number) {
        const [users, total] = await this.usersRepository.findAndCount({
            skip: (page - 1) * limit,
            take: limit,
            relations: { profile: true, role: true },
            where: { role: { role: rolesEnum.USER } }
        });

        const totalPages = Math.ceil(total / limit);
        const next = Number(page) + 1
        let prev = Number(page) - 1

        if (prev > totalPages) prev = totalPages


        return {
            data: users,
            total,
            page,
            limit,
            totalPages,
            nextPage: page < totalPages ? `${next}` : null,
            prevPage: page > 1 ? `${prev}` : null,
        };
    }

    async findById(id: number) {
        const user = await this.usersRepository.findOne({ where: { id }, relations: { profile: true, role: true } })
        if (!user) throw new HttpException("!کاربر یافت نشد", HttpStatus.NOT_FOUND)
        return user
    }

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


    async getProfile(userPayload: authPayload) {
        const { mobile } = userPayload
        const user = await this.usersRepository.findOne({ where: { mobile }, relations: { profile: true, role: true } })
        if (!user) throw new NotFoundException("مدیر پیدا نشد!")
        return user
    }

    async updateProfile(userPayload: authPayload, updateProfileDto: UpdateProfileDto) {
        await this.profilesService.update(userPayload.sub, updateProfileDto)
        const user = this.findByMobile(userPayload.mobile)
        return user
    }

    // * Iitialize section
    async _init_() {
        const count = await this.usersRepository.count()
        if (count) return

        const user = await this.usersService.create({
            mobile: '09012774031',
            password: 'm.kamran5559',
        })

        user.role = await this.rolesService.findByRole(rolesEnum.ADMIN)
        await this.usersRepository.save(user)


        // ? colored console.log for initialize
        console.log(rainbow('\n***************************'));
        console.log(rainbow('*                         *'));
        console.log(yellow("* Super admin initialized *"));
        console.log(rainbow('*                         *'));
        console.log(rainbow('***************************\n'));
    }
}


