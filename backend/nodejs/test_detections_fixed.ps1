Write-Host "=== 1. LOGIN ===" -ForegroundColor Cyan

$loginBody = @{
    email = "admin@traffic.com"
    password = "admin123"
} | ConvertTo-Json

$login = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method POST -ContentType "application/json" -Body $loginBody
$global:headers = @{Authorization="Bearer $($login.token)"}
Write-Host "Token obtenido" -ForegroundColor Green

Write-Host "`n=== 2. VERIFICAR INTELECCIONES ===" -ForegroundColor Cyan
try {
    $intersecciones = Invoke-RestMethod -Uri "http://localhost:3000/api/intersections" -Method GET -Headers $global:headers
    Write-Host "Total: $($intersecciones.Count)" -ForegroundColor Green
    $intersecciones | ForEach-Object { Write-Host "  ID: $($_.id) - $($_.nombre)" }
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== 3. VERIFICAR SENSORES ===" -ForegroundColor Cyan
try {
    $sensores = Invoke-RestMethod -Uri "http://localhost:3000/api/sensores" -Method GET -Headers $global:headers
    Write-Host "Total: $($sensores.Count)" -ForegroundColor Green
    $sensores | ForEach-Object { Write-Host "  ID: $($_.id) - $($_.nombre)" }
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== 4. VERIFICAR CAMARAS ===" -ForegroundColor Cyan
try {
    $cameras = Invoke-RestMethod -Uri "http://localhost:3000/api/cameras" -Method GET -Headers $global:headers
    Write-Host "Total: $($cameras.Count)" -ForegroundColor Green
    $cameras | ForEach-Object { Write-Host "  ID: $($_.id) - $($_.name)" }
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== 5. CREAR CAMARA SI NO EXISTE ===" -ForegroundColor Cyan

$cameras = Invoke-RestMethod -Uri "http://localhost:3000/api/cameras" -Method GET -Headers $global:headers

if ($cameras.Count -eq 0) {
    Write-Host "No hay camaras. Creando camara de prueba..." -ForegroundColor Yellow
    
    $sensores = Invoke-RestMethod -Uri "http://localhost:3000/api/sensores" -Method GET -Headers $global:headers
    
    if ($sensores.Count -eq 0) {
        Write-Host "No hay sensores. Creando sensor..." -ForegroundColor Yellow
        $sensorData = @{
            interseccion_id = 1
            nombre = "Sensor Parque Principal Ocana"
            tipo = "camara"
            estado = "activo"
            latitud = 8.2377
            longitud = -73.3560
        } | ConvertTo-Json
        $sensor = Invoke-RestMethod -Uri "http://localhost:3000/api/sensores" -Method POST -Headers $global:headers -ContentType "application/json" -Body $sensorData
        $sensorId = $sensor.sensor.id
    } else {
        $sensorId = $sensores[0].id
    }
    
    $cameraData = @{
        interseccion_id = 1
        sensor_id = $sensorId
        name = "Camara Parque Principal Ocana"
        url = "0"
        camera_type = "webcam"
        activo = $true
    } | ConvertTo-Json
    
    $camera = Invoke-RestMethod -Uri "http://localhost:3000/api/cameras" -Method POST -Headers $global:headers -ContentType "application/json" -Body $cameraData
    Write-Host "Camara creada: ID $($camera.camera.id) - $($camera.camera.name)" -ForegroundColor Green
    $global:cameraId = $camera.camera.id
} else {
    $global:cameraId = $cameras[0].id
    Write-Host "Usando camara existente: ID $global:cameraId" -ForegroundColor Green
}

Write-Host "`n=== 6. CREAR DETECCIONES ===" -ForegroundColor Cyan

$detections = @(
    @{ camera_id = $global:cameraId; interseccion_id = 1; personas = 5; carros = 12; motos = 8; buses = 2; camiones = 1 },
    @{ camera_id = $global:cameraId; interseccion_id = 1; personas = 3; carros = 8; motos = 5; buses = 1; camiones = 0 },
    @{ camera_id = $global:cameraId; interseccion_id = 1; personas = 7; carros = 15; motos = 10; buses = 3; camiones = 2 },
    @{ camera_id = $global:cameraId; interseccion_id = 1; personas = 2; carros = 6; motos = 4; buses = 0; camiones = 1 },
    @{ camera_id = $global:cameraId; interseccion_id = 1; personas = 4; carros = 10; motos = 6; buses = 1; camiones = 0 }
)

foreach ($detection in $detections) {
    $body = $detection | ConvertTo-Json
    try {
        $created = Invoke-RestMethod -Uri "http://localhost:3000/api/detections" -Method POST -Headers $global:headers -ContentType "application/json" -Body $body
        Write-Host "Deteccion creada: ID $($created.detection.id) - Total: $($created.detection.total)" -ForegroundColor Green
    } catch {
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n=== 7. LISTAR DETECCIONES ===" -ForegroundColor Cyan
try {
    $detections = Invoke-RestMethod -Uri "http://localhost:3000/api/detections?limit=10" -Method GET -Headers $global:headers
    Write-Host "Total: $($detections.Count)" -ForegroundColor Green
    $detections | ForEach-Object { Write-Host "  ID: $($_.id) - Total: $($_.total)" }
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== 8. ESTADISTICAS DEL DIA ===" -ForegroundColor Cyan
try {
    $stats = Invoke-RestMethod -Uri "http://localhost:3000/api/detections/stats/today" -Method GET -Headers $global:headers
    $stats | ConvertTo-Json -Depth 5
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== 9. ESTADISTICAS POR HORA ===" -ForegroundColor Cyan
try {
    $hourly = Invoke-RestMethod -Uri "http://localhost:3000/api/detections/stats/hourly" -Method GET -Headers $global:headers
    $hourly | ConvertTo-Json -Depth 5
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== 10. RESUMEN ===" -ForegroundColor Cyan
try {
    $summary = Invoke-RestMethod -Uri "http://localhost:3000/api/detections/stats/summary" -Method GET -Headers $global:headers
    $summary | ConvertTo-Json -Depth 5
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}