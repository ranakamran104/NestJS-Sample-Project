import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoryModule } from './category/category.module';
import { UserModule } from './user/user.module';
import { BlogpostModule } from './blogpost/blogpost.module';
import { PostcommentModule } from './postcomment/postcomment.module';
import { PostlikedModule } from './postliked/postliked.module';
// import { TasksModule } from './tasks/tasks.module';
// import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    // MongooseModule.forRoot(process.env.DB_URI),
    MongooseModule.forRoot(process.env.DB_URI || 'mongodb://localhost:27017'),
    // MongooseModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: (config: ConfigService) => {
    //     const username = config.get('DATABASE_USER');
    //     const password = config.get('DATABASE_PASSWORD');
    //     const host = config.get('DATABASE_HOST');
    //     const db = config.get('DATABASE_NAME');

    //     // const uri = `mongodb+srv://${username}:${password}@${host}/${db}?retryWrites=true&w=majority&appName=Cluster0&ssl=true`;
    //     const uri = `mongodb://${username}:${password}@${host}/${db}?ssl=true&replicaSet=atlas-hkz2t0-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0`;

    //     return { uri };
    //   },
    //   inject: [ConfigService],
    // }),
    CategoryModule,
    UserModule,
    BlogpostModule,
    PostcommentModule,
    PostlikedModule,
    // ScheduleModule.forRoot(),
    // TasksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
