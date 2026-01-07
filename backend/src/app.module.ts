import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BlogModule } from './blog/blog.module';
import { Blog } from './blog/entity/blog.entity';
import { HelloWorldResolver } from './hello-world/hello-world.resolver';
import { HelloWorldService } from './hello-world/hello-world.service';
import { User } from './user/entity/user.entity';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'rpg.db',
      entities: [User, Blog],
      synchronize: true, // Only for development
      logging: true, // For debugging
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: true, // Only for development
      introspection: true, // Only for development
      formatError: (error) => {
        const original = error.extensions?.originalError as
          | { message?: string | string[] }
          | undefined;

        const message =
          (Array.isArray(original?.message)
            ? original?.message?.[0]
            : typeof original?.message === 'string'
              ? original.message
              : undefined) ?? error.message;

        return {
          ...error,
          message,
        };
      },
    }),
    AuthModule,
    UserModule,
    BlogModule,
  ],
  controllers: [AppController],
  providers: [AppService, HelloWorldResolver, HelloWorldService],
})
export class AppModule {}
