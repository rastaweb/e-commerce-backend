import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from '../entities/profile.entity';
import { Repository } from 'typeorm';
import { CreateProfileDto } from '../dto/create.profile.dto';
import { User } from 'src/users/entities/user.entity';
import { UpdateProfileDto } from '../dto/update.profile.dto';

@Injectable()
export class ProfilesService {
    constructor(
        @InjectRepository(Profile) private readonly profileRepository: Repository<Profile>
    ) { }

    async createProfile(data: CreateProfileDto, user: User) {
        const newProfile = this.profileRepository.create({ ...data, user })
        await this.profileRepository.save(newProfile)
        return newProfile
    }


    async update(userId: number, updateProfileDto: UpdateProfileDto): Promise<Profile> {
        const profile = await this.profileRepository.findOne({ where: { user: { id: userId } } })
        if (!profile) {
            throw new NotFoundException('پروفایلی برای این کاربر پیدا نشد.');
        }
        Object.assign(profile, updateProfileDto);
        await this.profileRepository.save(profile);
        return profile
    }


}
