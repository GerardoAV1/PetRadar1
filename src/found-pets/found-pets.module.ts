import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FoundPet } from './entities/found-pet.entity';
import { FoundPetsController } from './found-pets.controller';
import { FoundPetsService } from './found-pets.service';
import { LostPetsModule } from 'src/lost-pets/lost-pets.module';

@Module({
  imports: [TypeOrmModule.forFeature([FoundPet]), LostPetsModule],
  controllers: [FoundPetsController],
  providers: [FoundPetsService],
})
export class FoundPetsModule {}
