import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configValidationSchema } from './confing.schema';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`],
      validationSchema: configValidationSchema,
    }),
    TasksModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configServices: ConfigService) => ({
        type: 'mysql',
        autoLoadEntities: true,
        synchronize: true,
        host: configServices.get('DB_HOST'),
        port: configServices.get('DB_PORT'),
        database: configServices.get('DB_DATABASE'),
        username: configServices.get('DB_USERNAME'),
        password: '',
      }),
    }),
    AuthModule,
  ],
})
export class AppModule {}
