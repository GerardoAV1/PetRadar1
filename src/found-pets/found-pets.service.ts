import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { FoundPet } from './entities/found-pet.entity';
import { LostPet } from 'src/lost-pets/entities/lost-pet.entity';
import { CreateFoundPetDto } from './dto/create-found-pet.dto';
import { NearbyLostPetMatch } from './dto/nearby-match.dto';

const SEARCH_RADIUS_METERS = 500;

@Injectable()
export class FoundPetsService {
  private readonly logger = new Logger(FoundPetsService.name);

  constructor(
    @InjectRepository(FoundPet)
    private readonly foundPetsRepo: Repository<FoundPet>,
    @InjectRepository(LostPet)
    private readonly lostPetsRepo: Repository<LostPet>,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Crea un registro de mascota encontrada y, en la misma operacion,
   * busca todas las lost_pets activas (is_active = true) dentro de un
   * radio de 500m usando PostGIS ST_DWithin.
   */
  async create(
    dto: CreateFoundPetDto,
  ): Promise<{ found_pet: FoundPet; matches: NearbyLostPetMatch[] }> {
    const foundPet = this.foundPetsRepo.create({
      species: dto.species,
      breed: dto.breed ?? null,
      color: dto.color ?? null,
      description: dto.description ?? null,
      finder_name: dto.finder_name,
      finder_email: dto.finder_email,
      finder_phone: dto.finder_phone ?? null,
      location: {
        type: 'Point',
        coordinates: [dto.lon, dto.lat],
      } as any,
    });
    const saved = await this.foundPetsRepo.save(foundPet);

    const matches = await this.findLostPetsWithinRadius(
      dto.lat,
      dto.lon,
      SEARCH_RADIUS_METERS,
    );

    this.logger.log(
      `FoundPet ${saved.id} creado. Coincidencias dentro de ${SEARCH_RADIUS_METERS}m: ${matches.length}`,
    );

    return { found_pet: saved, matches };
  }

  /**
   * Query espacial central:
   *
   *   SELECT *, ST_Distance(location::geography, point::geography) AS distance_meters
   *   FROM lost_pets
   *   WHERE is_active = true
   *     AND ST_DWithin(
   *       location::geography,
   *       ST_SetSRID(ST_MakePoint($lon, $lat), 4326)::geography,
   *       $radius
   *     );
   *
   * El cast a ::geography es OBLIGATORIO para que la distancia sea en metros.
   */
  async findLostPetsWithinRadius(
    lat: number,
    lon: number,
    radiusMeters: number,
  ): Promise<NearbyLostPetMatch[]> {
    const rows: Array<{
      id: string;
      pet_name: string;
      species: string;
      breed: string | null;
      color: string | null;
      description: string | null;
      contact_name: string;
      contact_email: string;
      contact_phone: string | null;
      distance_meters: string;
    }> = await this.dataSource.query(
      `
      SELECT
        id,
        pet_name,
        species::text AS species,
        breed,
        color,
        description,
        contact_name,
        contact_email,
        contact_phone,
        ST_Distance(
          location::geography,
          ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography
        ) AS distance_meters
      FROM lost_pets
      WHERE is_active = true
        AND ST_DWithin(
          location::geography,
          ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
          $3
        )
      ORDER BY distance_meters ASC
      `,
      [lon, lat, radiusMeters],
    );

    return rows.map((row) => ({
      id: row.id,
      pet_name: row.pet_name,
      species: row.species,
      breed: row.breed,
      color: row.color,
      description: row.description,
      contact_name: row.contact_name,
      contact_email: row.contact_email,
      contact_phone: row.contact_phone,
      distance_meters: Number(row.distance_meters),
    }));
  }

  async findAll(): Promise<FoundPet[]> {
    return this.foundPetsRepo.find({ order: { created_at: 'DESC' } });
  }
}
