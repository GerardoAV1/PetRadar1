import {
  Body,
  Controller,
  Get,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { FoundPetsService } from './found-pets.service';
import { CreateFoundPetDto } from './dto/create-found-pet.dto';

@Controller('found-pets')
export class FoundPetsController {
  constructor(private readonly foundPetsService: FoundPetsService) {}

  /**
   * POST /found-pets
   * Crea el registro y devuelve las lost_pets dentro de 500m (ST_DWithin).
   */
  @Post()
  async create(@Body() dto: CreateFoundPetDto) {
    return this.foundPetsService.create(dto);
  }

  /**
   * GET /found-pets → lista de mascotas encontradas.
   * Cacheado con Redis (TTL 60 segundos).
   */
  @Get()
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(60_000)
  async findAll() {
    return this.foundPetsService.findAll();
  }
}
