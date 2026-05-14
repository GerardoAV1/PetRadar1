# PetRadar API

API REST en NestJS para reportar mascotas perdidas y encontradas, con busqueda
geoespacial por radio (PostGIS), cache en Redis, telemetria en Azure Application
Insights y publicacion automatica de imagen Docker a GitHub Container Registry.

---

## Requisitos del examen (cubiertos)

| # | Requisito | Implementacion |
|---|-----------|----------------|
| 1 | Redis cache en endpoints GET | CacheModule + CacheInterceptor en GET /lost-pets y GET /found-pets |
| 2 | Azure Application Insights | src/telemetry/app-insights.ts cargado antes del bootstrap |
| 3 | Docker (imagen produccion) | Dockerfile multi-stage con usuario no-root |
| 4 | GitHub Actions -> GHCR | .github/workflows/docker-publish.yml |
| 5 | Busqueda por radio (500m) | ST_DWithin(location::geography, ..., 500) en FoundPetsService |

---

## Como correr localmente

### Opcion A: Con Docker Compose (recomendado)

```bash
docker compose up --build
```

Levanta:
- postgres (PostGIS) en 5432
- redis en 6379
- api (NestJS) en 3000

API: http://localhost:3000/api

### Opcion B: NodeJS en tu maquina, dependencias en Docker

```bash
docker compose up -d postgres redis
npm install
npm run start:dev
```

---

## Endpoints

### Mascotas perdidas

```
POST /api/lost-pets
{
  "pet_name": "Firulais",
  "species": "DOG",
  "breed": "Labrador",
  "color": "cafe",
  "description": "Llevaba collar rojo",
  "contact_name": "Gerardo",
  "contact_email": "amezquitavg@gmail.com",
  "contact_phone": "6181234567",
  "lat": 24.0277,
  "lon": -104.6532
}

GET   /api/lost-pets               # listado activo (cacheado Redis TTL 60s)
GET   /api/lost-pets/:id
PATCH /api/lost-pets/:id/deactivate
```

### Mascotas encontradas (incluye busqueda por radio)

```
POST /api/found-pets
{
  "species": "DOG",
  "breed": "Labrador",
  "color": "cafe",
  "description": "Estaba en el parque",
  "finder_name": "Vecino",
  "finder_email": "vecino@correo.com",
  "lat": 24.0280,
  "lon": -104.6530
}
```

Respuesta — incluye lost_pets activas dentro de 500m:

```json
{
  "found_pet": { "id": "uuid", "species": "DOG", "...": "..." },
  "matches": [
    {
      "id": "uuid",
      "pet_name": "Firulais",
      "distance_meters": 38.42,
      "contact_email": "amezquitavg@gmail.com"
    }
  ]
}
```

```
GET /api/found-pets   # listado, cacheado en Redis
```

---

## Query PostGIS (corazon del examen)

```sql
SELECT
  id,
  pet_name,
  ST_Distance(
    location::geography,
    ST_SetSRID(ST_MakePoint($lon, $lat), 4326)::geography
  ) AS distance_meters
FROM lost_pets
WHERE is_active = true
  AND ST_DWithin(
    location::geography,
    ST_SetSRID(ST_MakePoint($lon, $lat), 4326)::geography,
    500
  )
ORDER BY distance_meters ASC;
```

El cast ::geography es OBLIGATORIO para que ST_DWithin mida en metros.

---

## Variables de entorno

Ver .env.example. Claves:
- DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME
- REDIS_HOST, REDIS_PORT, REDIS_TTL_MS
- APPLICATIONINSIGHTS_CONNECTION_STRING (vacio = telemetria deshabilitada)

---

## Docker manual

```bash
docker build -t pet-radar-api .
docker run -p 3000:3000 --env-file .env pet-radar-api
```

---

## CI/CD (GitHub Actions -> GHCR)

El workflow .github/workflows/docker-publish.yml se dispara en cada push a main
o feature/examen-final y:
1. Hace login a ghcr.io con GITHUB_TOKEN
2. Construye la imagen Docker
3. La publica como ghcr.io/<usuario>/petradar1:<tag>

Para que aparezca publica: Settings -> Packages -> visibilidad Public.

---

## Esquema

- lost_pets: registros con is_active (true por defecto) y location geometry(Point,4326)
- found_pets: registros con location geometry(Point,4326)

Al primer arranque, db/init/01-postgis.sql instala las extensiones postgis y uuid-ossp.

TypeORM con synchronize=true crea las tablas automaticamente la primera vez
(apto solo para examen/demo).

---

## Autor

Gerardo Amezquita Villalobos — Proyecto 2 Parcial, materia Georeferenciados
