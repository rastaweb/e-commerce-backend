import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '../entities/role.entity';
import { Repository } from 'typeorm';
import { rainbow, yellow } from 'colors';
import { rolesEnum } from 'src/util/enums/rolesEnum';

@Injectable()
export class RolesService {
    constructor(
        @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    ) { }


    async findByRole(role: rolesEnum): Promise<Role> {
        const findedRole = await this.roleRepository.findOneBy({ role })
        if (!findedRole) throw new NotFoundException(`نقش ${role} پیدا نشد!`)
        return findedRole
    }

    async __init__() {
        const roles = [
            {
                role: rolesEnum.ADMIN,
                description: "این نقش برای ادمین است."
            },
            {
                role: rolesEnum.USER,
                description: "این نقش برای کاربر است."
            },
        ]
        const [, count] = await this.roleRepository.findAndCount()
        if (count) return
        try {
            for (const role of roles) {
                const newRole = this.roleRepository.create(role)
                await this.roleRepository.save(newRole)
            }
            // ? colored console.log for initialize
            console.log(rainbow('\n***************************'));
            console.log(rainbow('*                         *'));
            console.log(yellow("*    Roles initialized   *"));
            console.log(rainbow('*                         *'));
            console.log(rainbow('***************************\n'));
        } catch (e) {
            console.log(e);
            throw new InternalServerErrorException('خطایی رخ داد!');
        }
    }

}
