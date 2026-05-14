import { PetSpecies } from 'src/core/enums/pet-species.enum';

export class CreateLostPetDto {
  pet_name: string;
  species: PetSpecies;
  breed?: string;
  color?: string;
  description?: string;
  contact_name: string;
  contact_email: string;
  contact_phone?: string;
  lat: number;
  lon: number;
}
