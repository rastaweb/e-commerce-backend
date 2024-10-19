import { User } from "src/users/entities/user.entity";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('profiles')
export class Profile {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    family: string

    @Column({ nullable: true })
    national_code: string

    @OneToOne(() => User, user => user.profile)
    user: User
}