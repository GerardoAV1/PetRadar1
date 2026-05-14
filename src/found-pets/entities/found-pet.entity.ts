import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PetSpecies } from 'src/core/enums/pet-species.enum';

/**
 * Tabla found_pets: registros de mascotas encontradas.
 * Al crear un registro, el servicio buscará automáticamente todas las
 * lost_pets activas dentro de un radio de 500m usando ST_DWithin.
 */
@Entity({ name: 'found_pets' })
export class FoundPet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: PetSpecies, default: PetSpecies.OTHER })
  species: PetSpecies;

  @Column({ type: 'varchar', length: 80, nullable: true })
  breed: string | null;

  @Column({ type: 'varchar', length: 40, nullable: true })
  color: string | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'varchar', length: 150 })
  finder_name: string;

  @Column({ type: 'varchar', length: 150 })
  finder_email: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  finder_phone: string | null;

  @Index({ spatial: true })
  @Column({
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 4326,
  })
  location: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}
