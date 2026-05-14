/**
 * Resultado de la búsqueda por radio: una lost_pet activa que está
 * dentro de 500m del lugar donde se encontró la mascota.
 */
export class NearbyLostPetMatch {
  id: string;
  pet_name: string;
  species: string;
  breed: string | null;
  color: string | null;
  description: string | null;
  contact_name: string;
  contact_email: string;
  contact_phone: string | null;
  distance_meters: number;
}
