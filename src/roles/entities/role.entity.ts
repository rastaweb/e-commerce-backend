import { User } from 'src/users/entities/user.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('roles')
export class Role {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number

    @Column({ unique: true })
    role: string

    @Column({ nullable: true, type: 'varchar' })
    description: string

    @OneToMany(() => User, (user) => user.role)
    users: User[]

}
