Write-Host "=== 1. LOGIN ===" -ForegroundColor Cyan

$loginBody = @{
    email = "admin@traffic.com"
    password = "admin123"
} | ConvertTo-Json

$login = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method POST -ContentType "application/json" -Body $loginBody
$global:headers = @{Authorization="Bearer $($login.token)"}
Write-Host "Token obtenido" -ForegroundColor Green

Write-Host "`n=== 2. LISTAR SENSORES ===" -ForegroundColor Cyan
try {
    $sensores = Invoke-RestMethod -Uri "http://localhost:3000/api/sensores" -Method GET -Headers $global:headers
    Write-Host "Total: $($sensores.Count)" -ForegroundColor Green
    $sensores | ForEach-Object { Write-Host "  ID: $($_.id) - $($_.nombre) ($($_.tipo))" }
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== 3. CREAR SENSORES EN OCANA ===" -ForegroundColor Cyan

$sensores = @(
    @{ interseccion_id = 1; nombre = "Sensor Parque Principal"; tipo = "camara"; estado = "activo"; latitud = 8.2377; longitud = -73.3560 },
    @{ interseccion_id = 1; nombre = "Sensor Catedral Santa Ana"; tipo = "camara"; estado = "activo"; latitud = 8.2372; longitud = -73.3555 },
    @{ interseccion_id = 1; nombre = "Sensor Terminal"; tipo = "inductivo"; estado = "activo"; latitud = 8.2450; longitud = -73.3580 },
    @{ interseccion_id = 1; nombre = "Sensor Hospital Emiro Quintero"; tipo = "inductivo"; estado = "activo"; latitud = 8.2400; longitud = -73.3540 }
)

$sensoresCreados = @()
foreach ($sensor in $sensores) {
    $body = $sensor | ConvertTo-Json
    try {
        $created = Invoke-RestMethod -Uri "http://localhost:3000/api/sensores" -Method POST -Headers $global:headers -ContentType "application/json" -Body $body
        Write-Host "Sensor creado: ID $($created.sensor.id) - $($created.sensor.nombre)" -ForegroundColor Green
        $sensoresCreados += $created.sensor.id
    } catch {
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n=== 4. OBTENER SENSOR POR ID ===" -ForegroundColor Cyan
try {
    $sensor = Invoke-RestMethod -Uri "http://localhost:3000/api/sensores/1" -Method GET -Headers $global:headers
    $sensor | ConvertTo-Json -Depth 5
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== 5. ACTUALIZAR SENSOR ===" -ForegroundColor Cyan
$updateData = @{
    nombre = "Sensor Parque Principal Actualizado"
    estado = "mantenimiento"
} | ConvertTo-Json

try {
    $updated = Invoke-RestMethod -Uri "http://localhost:3000/api/sensores/1" -Method PUT -Headers $global:headers -ContentType "application/json" -Body $updateData
    Write-Host "Sensor actualizado:" -ForegroundColor Green
    Write-Host "  Nombre: $($updated.sensor.nombre)"
    Write-Host "  Estado: $($updated.sensor.estado)"
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== 6. SENSORES POR INTERSECCION ===" -ForegroundColor Cyan
try {
    $porInterseccion = Invoke-RestMethod -Uri "http://localhost:3000/api/sensores/interseccion/1" -Method GET -Headers $global:headers
    Write-Host "Total: $($porInterseccion.Count)" -ForegroundColor Green
    $porInterseccion | ForEach-Object { Write-Host "  ID: $($_.id) - $($_.nombre) - Camaras: $($_.total_camaras)" }
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== 7. ELIMINAR SENSOR ===" -ForegroundColor Cyan
try {
    $deleted = Invoke-RestMethod -Uri "http://localhost:3000/api/sensores/4" -Method DELETE -Headers $global:headers
    Write-Host "Sensor eliminado: ID $($deleted.sensor.id) - $($deleted.sensor.nombre)" -ForegroundColor Green
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}