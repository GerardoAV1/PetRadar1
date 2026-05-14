# Script de prueba completo - PetRadar API
# Uso: .\test-api.ps1

Write-Host "=== Probando POST /lost-pets ===" -ForegroundColor Cyan
$lost = @{
    pet_name      = "Firulais"
    species       = "DOG"
    breed         = "Labrador"
    color         = "cafe"
    contact_name  = "Gerardo"
    contact_email = "amezquitavg@gmail.com"
    contact_phone = "6181234567"
    lat           = 24.0277
    lon           = -104.6532
} | ConvertTo-Json

try {
    $lostResp = Invoke-RestMethod -Method Post -Uri "http://localhost:3000/api/lost-pets" -ContentType "application/json" -Body $lost
    Write-Host "OK - lost-pet creado:" -ForegroundColor Green
    $lostResp | ConvertTo-Json -Depth 5
} catch {
    Write-Host "ERROR en lost-pets:" -ForegroundColor Red
    Write-Host $_.Exception.Message
    Write-Host "--- Logs del contenedor ---"
    docker logs petradar-api --tail 40
    exit 1
}

Write-Host "`n=== Probando POST /found-pets (debe regresar matches dentro de 500m) ===" -ForegroundColor Cyan
$found = @{
    species       = "DOG"
    breed         = "Labrador"
    color         = "cafe"
    finder_name   = "Vecino"
    finder_email  = "vecino@correo.com"
    lat           = 24.0280
    lon           = -104.6530
} | ConvertTo-Json

try {
    $foundResp = Invoke-RestMethod -Method Post -Uri "http://localhost:3000/api/found-pets" -ContentType "application/json" -Body $found
    Write-Host "OK - found-pet creado con matches:" -ForegroundColor Green
    $foundResp | ConvertTo-Json -Depth 6
} catch {
    Write-Host "ERROR en found-pets:" -ForegroundColor Red
    Write-Host $_.Exception.Message
    Write-Host "--- Logs del contenedor ---"
    docker logs petradar-api --tail 40
    exit 1
}

Write-Host "`n=== TODO OK - examen funcional ===" -ForegroundColor Green
