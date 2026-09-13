Write-Host "=== 1. LOGIN ===" -ForegroundColor Cyan

$loginBody = @{
    email = "admin@traffic.com"
    password = "admin123"
} | ConvertTo-Json

$login = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method POST -ContentType "application/json" -Body $loginBody
$global:headers = @{Authorization="Bearer $($login.token)"}
Write-Host "Token obtenido" -ForegroundColor Green

Write-Host "`n=== 2. CREAR SENSORES EN OCANA ===" -ForegroundColor Cyan

$sensores = @(
    @{ interseccion_id = 1; nombre = "Sensor Parque Principal"; tipo = "camara"; estado = "activo"; latitud = 8.2377; longitud = -73.3560 },
    @{ interseccion_id = 1; nombre = "Sensor Catedral Santa Ana"; tipo = "camara"; estado = "activo"; latitud = 8.2372; longitud = -73.3555 },
    @{ interseccion_id = 1; nombre = "Sensor Terminal"; tipo = "inductivo"; estado = "activo"; latitud = 8.2450; longitud = -73.3580 },
    @{ interseccion_id = 1; nombre = "Sensor Hospital Emiro Quintero"; tipo = "inductivo"; estado = "activo"; latitud = 8.2400; longitud = -73.3540 }
)

$sensorIds = @()
foreach ($sensor in $sensores) {
    $body = $sensor | ConvertTo-Json
    try {
        $created = Invoke-RestMethod -Uri "http://localhost:3000/api/sensores" -Method POST -Headers $global:headers -ContentType "application/json" -Body $body
        Write-Host "Sensor creado: ID $($created.sensor.id) - $($created.sensor.nombre)" -ForegroundColor Green
        $sensorIds += $created.sensor.id
    } catch {
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`nIDs de sensores creados: $($sensorIds -join ', ')" -ForegroundColor Yellow

Write-Host "`n=== 3. CREAR CAMARAS EN OCANA ===" -ForegroundColor Cyan

if ($sensorIds.Count -ge 4) {
    $cameras = @(
        @{ interseccion_id = 1; sensor_id = $sensorIds[0]; name = "Camara Parque Principal"; url = "0"; camera_type = "webcam"; activo = $true },
        @{ interseccion_id = 1; sensor_id = $sensorIds[1]; name = "Camara Catedral Santa Ana"; url = "http://192.168.1.20:8080/video"; camera_type = "wifi"; activo = $true },
        @{ interseccion_id = 1; sensor_id = $sensorIds[2]; name = "Camara Terminal"; url = "http://192.168.1.21:8080/video"; camera_type = "wifi"; activo = $true },
        @{ interseccion_id = 1; sensor_id = $sensorIds[3]; name = "Camara Hospital Emiro Quintero"; url = "rtsp://192.168.1.22:554/stream"; camera_type = "ip"; activo = $true }
    )

    foreach ($camera in $cameras) {
        $body = $camera | ConvertTo-Json
        try {
            $created = Invoke-RestMethod -Uri "http://localhost:3000/api/cameras" -Method POST -Headers $global:headers -ContentType "application/json" -Body $body
            Write-Host "Camara creada: ID $($created.camera.id) - $($created.camera.name)" -ForegroundColor Green
        } catch {
            Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
} else {
    Write-Host "No se crearon suficientes sensores" -ForegroundColor Red
}

Write-Host "`n=== 4. LISTAR SENSORES ===" -ForegroundColor Cyan
try {
    $sensores = Invoke-RestMethod -Uri "http://localhost:3000/api/sensores" -Method GET -Headers $global:headers
    $sensores | ForEach-Object { Write-Host "  ID: $($_.id) - $($_.nombre) ($($_.tipo))" }
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== 5. LISTAR CAMARAS ===" -ForegroundColor Cyan
try {
    $cameras = Invoke-RestMethod -Uri "http://localhost:3000/api/cameras" -Method GET -Headers $global:headers
    $cameras | ForEach-Object { Write-Host "  ID: $($_.id) - $($_.name) ($($_.camera_type))" }
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== COMPLETADO ===" -ForegroundColor Green