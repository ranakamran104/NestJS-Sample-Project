import * as AutoIncrementFactory from 'mongoose-sequence';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import { Connection } from 'mongoose';
import { JwtMiddleware } from 'src/middlewares/jwt.middleware';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: async (connection: Connection) => {
          const schema = UserSchema;
          const AutoIncrement = AutoIncrementFactory(connection as any);
          schema.plugin(AutoIncrement as any, {
            id: 'userId',
            inc_field: 'id',
          });
          return schema;
        },
        inject: [getConnectionToken()],
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, JwtAuthGuard, JwtService],
})
// export class UserModule {}
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes(
      { path: 'auth/all-user', method: RequestMethod.GET },
      // { path: 'users/update', method: RequestMethod.PUT },
      // Add more routes and methods as needed
    );
  }
}
