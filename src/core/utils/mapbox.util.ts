import { envs } from 'src/config/envs';

/**
 * Genera la URL de una imagen estática de Mapbox con un pin en la ubicación dada.
 * Útil para incrustar mapas en correos electrónicos de notificación.
 */
export const generateMapboxStaticImage = (lat: number, lon: number): string => {
  const accessToken = envs.MAPBOX_TOKEN;
  const zoom = 14;
  const width = 800;
  const height = 400;
  return `https://api.mapbox.com/styles/v1/mapbox/light-v11/static/pin-s-l+f00(${lon},${lat})/${lon},${lat},${zoom}/${width}x${height}?access_token=${accessToken}`;
};
