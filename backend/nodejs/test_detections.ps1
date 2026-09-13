Write-Host "=== 1. LOGIN ===" -ForegroundColor Cyan

$loginBody = @{
    email = "admin@traffic.com"
    password = "admin123"
} | ConvertTo-Json

$login = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method POST -ContentType "application/json" -Body $loginBody
$global:headers = @{Authorization="Bearer $($login.token)"}
Write-Host "Token obtenido" -ForegroundColor Green

Write-Host "`n=== 2. LISTAR DETECCIONES ===" -ForegroundColor Cyan
try {
    $detections = Invoke-RestMethod -Uri "http://localhost:3000/api/detections?limit=10" -Method GET -Headers $global:headers
    Write-Host "Total: $($detections.Count)" -ForegroundColor Green
    $detections | ForEach-Object { Write-Host "  ID: $($_.id) - $($_.timestamp) - Total: $($_.total)" }
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== 3. CREAR DETECCIONES EN OCANA ===" -ForegroundColor Cyan

$detections = @(
    @{ camera_id = 1; personas = 5; carros = 12; motos = 8; buses = 2; camiones = 1 },
    @{ camera_id = 1; personas = 3; carros = 8; motos = 5; buses = 1; camiones = 0 },
    @{ camera_id = 1; personas = 7; carros = 15; motos = 10; buses = 3; camiones = 2 },
    @{ camera_id = 1; personas = 2; carros = 6; motos = 4; buses = 0; camiones = 1 },
    @{ camera_id = 1; personas = 4; carros = 10; motos = 6; buses = 1; camiones = 0 }
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

Write-Host "`n=== 4. OBTENER DETECCION POR ID ===" -ForegroundColor Cyan
try {
    $detection = Invoke-RestMethod -Uri "http://localhost:3000/api/detections/1" -Method GET -Headers $global:headers
    $detection | ConvertTo-Json -Depth 5
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== 5. ESTADISTICAS DEL DIA ===" -ForegroundColor Cyan
try {
    $stats = Invoke-RestMethod -Uri "http://localhost:3000/api/detections/stats/today" -Method GET -Headers $global:headers
    $stats | ConvertTo-Json -Depth 5
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== 6. ESTADISTICAS POR HORA ===" -ForegroundColor Cyan
try {
    $hourly = Invoke-RestMethod -Uri "http://localhost:3000/api/detections/stats/hourly" -Method GET -Headers $global:headers
    $hourly | ConvertTo-Json -Depth 5
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== 7. RESUMEN ===" -ForegroundColor Cyan
try {
    $summary = Invoke-RestMethod -Uri "http://localhost:3000/api/detections/stats/summary" -Method GET -Headers $global:headers
    $summary | ConvertTo-Json -Depth 5
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== 8. DETECCIONES POR CAMARA ===" -ForegroundColor Cyan
try {
    $porCamara = Invoke-RestMethod -Uri "http://localhost:3000/api/detections/camera/1?limit=5" -Method GET -Headers $global:headers
    Write-Host "Total: $($porCamara.Count)" -ForegroundColor Green
    $porCamara | ForEach-Object { Write-Host "  ID: $($_.id) - Total: $($_.total)" }
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== 9. DETECCIONES POR INTERSECCION ===" -ForegroundColor Cyan
try {
    $porInterseccion = Invoke-RestMethod -Uri "http://localhost:3000/api/detections/interseccion/1?limit=5" -Method GET -Headers $global:headers
    Write-Host "Total: $($porInterseccion.Count)" -ForegroundColor Green
    $porInterseccion | ForEach-Object { Write-Host "  ID: $($_.id) - Total: $($_.total)" }
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}