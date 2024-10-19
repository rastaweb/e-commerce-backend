import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ProfilesModule } from './profiles/profiles.module';
import { User } from './users/entities/user.entity';
import { Profile } from './profiles/entities/profile.entity';
import { UsersAdminService } from './users/services/users.admin.service';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';
import { Role } from './roles/entities/role.entity';
import { RolesService } from './roles/services/roles.service';
import { ProductsModule } from './products/products.module';

const typeOrm = TypeOrmModule.forRoot({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'm.kamran5559',
  database: 'shop',
  entities: [User, Profile, Role],
  synchronize: true,

})


@Module({
  imports: [
    typeOrm,
    UsersModule,
    ProfilesModule,
    AuthModule,
    RolesModule,
    ProductsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor(
    private readonly usersAdminServise: UsersAdminService,
    private readonly rolesService: RolesService,

  ) { }

  async onModuleInit() {
    await this.rolesService.__init__()
    await this.usersAdminServise._init_()
  }

}


