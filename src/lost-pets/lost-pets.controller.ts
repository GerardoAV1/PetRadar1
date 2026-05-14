import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { LostPetsService } from './lost-pets.service';
import { CreateLostPetDto } from './dto/create-lost-pet.dto';

@Controller('lost-pets')
export class LostPetsController {
  constructor(private readonly lostPetsService: LostPetsService) {}

  @Post()
  async create(@Body() dto: CreateLostPetDto) {
    return this.lostPetsService.create(dto);
  }

  /**
   * GET /lost-pets → lista mascotas perdidas activas.
   * Cacheado con Redis (TTL 60 segundos).
   */
  @Get()
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(60_000)
  async findAllActive() {
    return this.lostPetsService.findAllActive();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.lostPetsService.findOne(id);
  }

  @Patch(':id/deactivate')
  async deactivate(@Param('id') id: string) {
    return this.lostPetsService.deactivate(id);
  }
}
