Write-Host "=== 1. LOGIN ===" -ForegroundColor Cyan

$loginBody = @{
    email = "admin@traffic.com"
    password = "admin123"
} | ConvertTo-Json

$login = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method POST -ContentType "application/json" -Body $loginBody
$global:headers = @{Authorization="Bearer $($login.token)"}
Write-Host "Token obtenido" -ForegroundColor Green

Write-Host "`n=== 2. LISTAR FASES ===" -ForegroundColor Cyan
try {
    $fases = Invoke-RestMethod -Uri "http://localhost:3000/api/fases" -Method GET -Headers $global:headers
    Write-Host "Total: $($fases.Count)" -ForegroundColor Green
    $fases | ForEach-Object { Write-Host "  ID: $($_.id) - $($_.nombre) - $($_.duracion)s - $($_.color)" }
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== 3. CREAR FASES PARA EL SEMAFORO 1 (PARQUE PRINCIPAL OCANA) ===" -ForegroundColor Cyan

$fases = @(
    @{ semaforo_id = 1; nombre = "Verde Parque Principal"; duracion = 30; orden = 1; color = "verde" },
    @{ semaforo_id = 1; nombre = "Amarillo Parque Principal"; duracion = 5; orden = 2; color = "amarillo" },
    @{ semaforo_id = 1; nombre = "Rojo Parque Principal"; duracion = 25; orden = 3; color = "rojo" }
)

foreach ($fase in $fases) {
    $body = $fase | ConvertTo-Json
    try {
        $created = Invoke-RestMethod -Uri "http://localhost:3000/api/fases" -Method POST -Headers $global:headers -ContentType "application/json" -Body $body
        Write-Host "Fase creada: ID $($created.fase.id) - $($created.fase.nombre) - $($created.fase.duracion)s" -ForegroundColor Green
    } catch {
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n=== 4. OBTENER FASE POR ID ===" -ForegroundColor Cyan
try {
    $fase = Invoke-RestMethod -Uri "http://localhost:3000/api/fases/1" -Method GET -Headers $global:headers
    $fase | ConvertTo-Json -Depth 5
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== 5. ACTUALIZAR FASE ===" -ForegroundColor Cyan
$updateData = @{
    duracion = 45
    nombre = "Verde Parque Principal Extendido"
} | ConvertTo-Json

try {
    $updated = Invoke-RestMethod -Uri "http://localhost:3000/api/fases/1" -Method PUT -Headers $global:headers -ContentType "application/json" -Body $updateData
    Write-Host "Fase actualizada:" -ForegroundColor Green
    Write-Host "  Nombre: $($updated.fase.nombre)"
    Write-Host "  Duracion: $($updated.fase.duracion)s"
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== 6. FASES POR SEMAFORO ===" -ForegroundColor Cyan
try {
    $porSemaforo = Invoke-RestMethod -Uri "http://localhost:3000/api/fases/semaforo/1" -Method GET -Headers $global:headers
    Write-Host "Total: $($porSemaforo.Count)" -ForegroundColor Green
    $porSemaforo | ForEach-Object { Write-Host "  Orden $($_.orden): $($_.nombre) - $($_.duracion)s - $($_.color)" }
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== 7. ELIMINAR FASE ===" -ForegroundColor Cyan
try {
    $deleted = Invoke-RestMethod -Uri "http://localhost:3000/api/fases/3" -Method DELETE -Headers $global:headers
    Write-Host "Fase eliminada: ID $($deleted.fase.id) - $($deleted.fase.nombre)" -ForegroundColor Green
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}