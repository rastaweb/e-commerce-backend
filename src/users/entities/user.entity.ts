import { Exclude } from "class-transformer";
import { Profile } from "src/profiles/entities/profile.entity";
import { Role } from "src/roles/entities/role.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true })
    mobile: string

    @Column({ nullable: true, unique: true })
    username: string

    @Column({ nullable: true })
    email: string

    @Column()
    @Exclude()
    password: string

    @Column({ default: true, type: 'boolean' })
    isActive: boolean

    @OneToOne(() => Profile, profile => profile.user)
    @JoinColumn()
    profile: Profile

    @ManyToOne(() => Role, (role) => role.users)
    role: Role
}