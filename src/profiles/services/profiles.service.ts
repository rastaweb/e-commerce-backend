import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from '../entities/profile.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProfilesService {
    constructor(
        @InjectRepository(Profile) private readonly profileRepository: Repository<Profile>
    ) { }


    createProfile(data: any) {
        this.profileRepository.create(data)
    }
}
