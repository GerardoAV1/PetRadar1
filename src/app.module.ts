import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { envs } from './config/envs';
import { LostPetsModule } from './lost-pets/lost-pets.module';
import { FoundPetsModule } from './found-pets/found-pets.module';

@Module({
  imports: [
    /**
     * TypeORM con PostgreSQL + PostGIS.
     * autoLoadEntities=true para que cargue LostPet y FoundPet automaticamente.
     * synchronize=true SOLO para el examen (crea tablas al arrancar).
     */
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: envs.DB_HOST,
      port: envs.DB_PORT,
      database: envs.DB_NAME,
      username: envs.DB_USER,
      password: envs.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true,
    }),

    /**
     * Cache global con Redis. Aplica a endpoints decorados con
     * @UseInterceptors(CacheInterceptor).
     */
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        store: await redisStore({
          socket: {
            host: envs.REDIS_HOST,
            port: envs.REDIS_PORT,
          },
        }),
        ttl: envs.REDIS_TTL_MS,
      }),
    }),

    LostPetsModule,
    FoundPetsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
