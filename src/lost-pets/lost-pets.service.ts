import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LostPet } from './entities/lost-pet.entity';
import { CreateLostPetDto } from './dto/create-lost-pet.dto';

@Injectable()
export class LostPetsService {
  constructor(
    @InjectRepository(LostPet)
    private readonly lostPetsRepo: Repository<LostPet>,
  ) {}

  /**
   * Crea un registro de mascota perdida.
   * TypeORM espera la geometria en formato GeoJSON y la envuelve con
   * ST_GeomFromGeoJSON() + ST_SetSRID(..., 4326) automaticamente.
   */
  async create(dto: CreateLostPetDto): Promise<LostPet> {
    const pet = this.lostPetsRepo.create({
      pet_name: dto.pet_name,
      species: dto.species,
      breed: dto.breed ?? null,
      color: dto.color ?? null,
      description: dto.description ?? null,
      contact_name: dto.contact_name,
      contact_email: dto.contact_email,
      contact_phone: dto.contact_phone ?? null,
      location: {
        type: 'Point',
        coordinates: [dto.lon, dto.lat],
      } as any,
      is_active: true,
    });
    return this.lostPetsRepo.save(pet);
  }

  async findAllActive(): Promise<LostPet[]> {
    return this.lostPetsRepo.find({
      where: { is_active: true },
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: string): Promise<LostPet> {
    const pet = await this.lostPetsRepo.findOne({ where: { id } });
    if (!pet) {
      throw new NotFoundException(`Lost pet ${id} no encontrada`);
    }
    return pet;
  }

  async deactivate(id: string): Promise<LostPet> {
    const pet = await this.findOne(id);
    pet.is_active = false;
    return this.lostPetsRepo.save(pet);
  }
}
