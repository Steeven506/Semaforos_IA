Write-Host "=== 1. LOGIN ===" -ForegroundColor Cyan

$loginBody = @{
    email = "admin@traffic.com"
    password = "admin123"
} | ConvertTo-Json

$login = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method POST -ContentType "application/json" -Body $loginBody
$global:headers = @{Authorization="Bearer $($login.token)"}
Write-Host "Token obtenido" -ForegroundColor Green

Write-Host "`n=== 2. LISTAR CAMARAS ===" -ForegroundColor Cyan
try {
    $cameras = Invoke-RestMethod -Uri "http://localhost:3000/api/cameras" -Method GET -Headers $global:headers
    Write-Host "Total: $($cameras.Count)" -ForegroundColor Green
    $cameras | ForEach-Object { Write-Host "  ID: $($_.id) - $($_.name) ($($_.camera_type))" }
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== 3. CREAR CAMARAS EN OCANA ===" -ForegroundColor Cyan

$cameras = @(
    @{ interseccion_id = 1; sensor_id = 1; name = "Camara Parque Principal"; url = "0"; camera_type = "webcam"; activo = $true },
    @{ interseccion_id = 1; sensor_id = 2; name = "Camara Catedral Santa Ana"; url = "http://192.168.1.20:8080/video"; camera_type = "wifi"; activo = $true },
    @{ interseccion_id = 1; sensor_id = 3; name = "Camara Terminal"; url = "http://192.168.1.21:8080/video"; camera_type = "wifi"; activo = $true },
    @{ interseccion_id = 1; sensor_id = 4; name = "Camara Hospital"; url = "rtsp://192.168.1.22:554/stream"; camera_type = "ip"; activo = $true }
)

$camarasCreadas = @()
foreach ($camera in $cameras) {
    $body = $camera | ConvertTo-Json
    try {
        $created = Invoke-RestMethod -Uri "http://localhost:3000/api/cameras" -Method POST -Headers $global:headers -ContentType "application/json" -Body $body
        Write-Host "Camara creada: ID $($created.camera.id) - $($created.camera.name)" -ForegroundColor Green
        $camarasCreadas += $created.camera.id
    } catch {
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n=== 4. OBTENER CAMARA POR ID ===" -ForegroundColor Cyan
try {
    $camera = Invoke-RestMethod -Uri "http://localhost:3000/api/cameras/1" -Method GET -Headers $global:headers
    $camera | ConvertTo-Json -Depth 5
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== 5. ACTUALIZAR CAMARA ===" -ForegroundColor Cyan
$updateData = @{
    name = "Camara Parque Principal Actualizada"
    camera_type = "wifi"
    url = "http://192.168.1.30:8080/video"
} | ConvertTo-Json

try {
    $updated = Invoke-RestMethod -Uri "http://localhost:3000/api/cameras/1" -Method PUT -Headers $global:headers -ContentType "application/json" -Body $updateData
    Write-Host "Camara actualizada:" -ForegroundColor Green
    Write-Host "  Nombre: $($updated.camera.name)"
    Write-Host "  Tipo: $($updated.camera.camera_type)"
    Write-Host "  URL: $($updated.camera.url)"
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== 6. CAMARAS POR INTERSECCION ===" -ForegroundColor Cyan
try {
    $porInterseccion = Invoke-RestMethod -Uri "http://localhost:3000/api/cameras/interseccion/1" -Method GET -Headers $global:headers
    Write-Host "Total: $($porInterseccion.Count)" -ForegroundColor Green
    $porInterseccion | ForEach-Object { Write-Host "  ID: $($_.id) - $($_.name) - Sensor: $($_.sensor_nombre)" }
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== 7. CAMARAS POR SENSOR ===" -ForegroundColor Cyan
try {
    $porSensor = Invoke-RestMethod -Uri "http://localhost:3000/api/cameras/sensor/1" -Method GET -Headers $global:headers
    Write-Host "Total: $($porSensor.Count)" -ForegroundColor Green
    $porSensor | ForEach-Object { Write-Host "  ID: $($_.id) - $($_.name)" }
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== 8. ELIMINAR CAMARA ===" -ForegroundColor Cyan
try {
    $deleted = Invoke-RestMethod -Uri "http://localhost:3000/api/cameras/4" -Method DELETE -Headers $global:headers
    Write-Host "Camara eliminada: ID $($deleted.camera.id) - $($deleted.camera.name)" -ForegroundColor Green
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}