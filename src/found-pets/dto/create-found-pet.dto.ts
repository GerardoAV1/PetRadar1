import { PetSpecies } from 'src/core/enums/pet-species.enum';

export class CreateFoundPetDto {
  species: PetSpecies;
  breed?: string;
  color?: string;
  description?: string;
  finder_name: string;
  finder_email: string;
  finder_phone?: string;
  lat: number;
  lon: number;
}
