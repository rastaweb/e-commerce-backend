import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ProfilesModule } from './profiles/profiles.module';
import { UsersAdminService } from './users/services/users.admin.service';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';
import { RolesService } from './roles/services/roles.service';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { GlobalModules } from './config/global-modules.config';

@Module({
  imports: [
    ...GlobalModules,
    UsersModule,
    ProfilesModule,
    AuthModule,
    RolesModule,
    ProductsModule,
    CategoriesModule,
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


