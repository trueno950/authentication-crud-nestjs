import { BrandModule } from './brand/brand.module';
import { RoleModule } from './role/role.module';
import { ProductsModule } from './product/product.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import ormconfig from '../orm.config';
import { EmailModule } from './mail/email.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ormconfig,
    }),
    AuthModule,
    BrandModule,
    ProductsModule,
    UserModule,
    EmailModule,
    RoleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
