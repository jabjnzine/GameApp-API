import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'db/data-source';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { GamesModule } from './games/games.module';
import { CategoryModule } from './category/category.module';
import { AwsModule } from './aws/aws.module';
import { CategoryGamesModule } from './category_games/category_games.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [],
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    UserModule,
    AuthModule,
    GamesModule,
    CategoryModule,
    AwsModule,
    CategoryGamesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
