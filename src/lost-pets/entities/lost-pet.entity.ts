import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PetSpecies } from 'src/core/enums/pet-species.enum';

/**
 * Tabla lost_pets: registros de mascotas perdidas.
 * La columna `location` es PostGIS geometry(Point, 4326).
 * Para búsquedas por radio en metros se usa el cast ::geography en la query.
 */
@Entity({ name: 'lost_pets' })
export class LostPet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 120 })
  pet_name: string;

  @Column({ type: 'enum', enum: PetSpecies, default: PetSpecies.OTHER })
  species: PetSpecies;

  @Column({ type: 'varchar', length: 80, nullable: true })
  breed: string | null;

  @Column({ type: 'varchar', length: 40, nullable: true })
  color: string | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'varchar', length: 150 })
  contact_name: string;

  @Column({ type: 'varchar', length: 150 })
  contact_email: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  contact_phone: string | null;

  /**
   * Punto geográfico (lon, lat) almacenado como geometry(Point, 4326).
   * Indexado con GIST para acelerar las búsquedas espaciales.
   */
  @Index({ spatial: true })
  @Column({
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 4326,
  })
  location: string; // WKT o GeoJSON al insertar; TypeORM serializa como string

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
