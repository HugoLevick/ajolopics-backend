import { join } from 'path';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { AssetsModule } from './assets/assets.module';
import { TagsModule } from './tags/tags.module';
import { CommonModule } from './common/common.module';
import typeorm from './config/typeorm';

@Module({
  imports: [
    // Load configuration globally and TypeORM configuration from the typeorm.ts file
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeorm],
    }),
    // Asynchronously configure TypeORM using the ConfigService to get the database configuration
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.getOrThrow('typeorm'),
    }),
    // Serve static files from the 'uploads' directory
    ServeStaticModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => [
        {
          rootPath: join(
            __dirname,
            '..',
            configService.getOrThrow('UPLOAD_DIR'),
          ),
          serveRoot: '/uploads',
          serveStaticOptions: {
            redirect: false, // Disable automatic redirection to index.html'
          },
        },
        {
          rootPath: join(
            __dirname,
            '..',
            configService.getOrThrow('FRONTEND_DIR'),
          ),
          serveRoot: '/',
        },
      ],
    }),
    AuthModule,
    UsersModule,
    PostsModule,
    AssetsModule,
    TagsModule,
    CommonModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
