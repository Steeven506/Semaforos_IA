Write-Host "=== 1. LOGIN ===" -ForegroundColor Cyan

$loginBody = @{
    email = "admin@traffic.com"
    password = "admin123"
} | ConvertTo-Json

$login = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method POST -ContentType "application/json" -Body $loginBody
$global:headers = @{Authorization="Bearer $($login.token)"}
Write-Host "Token obtenido" -ForegroundColor Green

Write-Host "`n=== 2. LISTAR SEMAFOROS ===" -ForegroundColor Cyan
try {
    $semaforos = Invoke-RestMethod -Uri "http://localhost:3000/api/semaforos" -Method GET -Headers $global:headers
    Write-Host "Total: $($semaforos.Count)" -ForegroundColor Green
    $semaforos | ForEach-Object { Write-Host "  ID: $($_.id) - $($_.nombre) ($($_.tipo))" }
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== 3. CREAR SEMAFORO ===" -ForegroundColor Cyan
$newSemaforo = @{
    interseccion_id = 1
    nombre = "Semaforo Principal"
    tipo = "vehicular"
    estado = "activo"
    latitud = 4.6097
    longitud = -74.0817
} | ConvertTo-Json

try {
    $created = Invoke-RestMethod -Uri "http://localhost:3000/api/semaforos" -Method POST -Headers $global:headers -ContentType "application/json" -Body $newSemaforo
    Write-Host "Semaforo creado:" -ForegroundColor Green
    Write-Host "  ID: $($created.semaforo.id) - $($created.semaforo.nombre)"
    $global:newId = $created.semaforo.id
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

if ($global:newId) {
    Write-Host "`n=== 4. OBTENER POR ID ===" -ForegroundColor Cyan
    try {
        $semaforo = Invoke-RestMethod -Uri "http://localhost:3000/api/semaforos/$global:newId" -Method GET -Headers $global:headers
        $semaforo | ConvertTo-Json -Depth 5
    } catch {
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    }

    Write-Host "`n=== 5. ACTUALIZAR ===" -ForegroundColor Cyan
    $updateData = @{
        nombre = "Semaforo Principal Actualizado"
        estado = "mantenimiento"
    } | ConvertTo-Json

    try {
        $updated = Invoke-RestMethod -Uri "http://localhost:3000/api/semaforos/$global:newId" -Method PUT -Headers $global:headers -ContentType "application/json" -Body $updateData
        Write-Host "Semaforo actualizado:" -ForegroundColor Green
        Write-Host "  Nombre: $($updated.semaforo.nombre)"
        Write-Host "  Estado: $($updated.semaforo.estado)"
    } catch {
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    }

    Write-Host "`n=== 8. ELIMINAR ===" -ForegroundColor Cyan
    try {
        $deleted = Invoke-RestMethod -Uri "http://localhost:3000/api/semaforos/$global:newId" -Method DELETE -Headers $global:headers
        Write-Host "Semaforo eliminado:" -ForegroundColor Green
        Write-Host "  ID: $($deleted.semaforo.id)"
    } catch {
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n=== 6. SEMAFOROS POR INTERSECCION ===" -ForegroundColor Cyan
try {
    $porInterseccion = Invoke-RestMethod -Uri "http://localhost:3000/api/semaforos/intersection/1" -Method GET -Headers $global:headers
    Write-Host "Total: $($porInterseccion.Count)" -ForegroundColor Green
    $porInterseccion | ForEach-Object { Write-Host "  ID: $($_.id) - $($_.nombre) - Fases: $($_.total_fases)" }
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}