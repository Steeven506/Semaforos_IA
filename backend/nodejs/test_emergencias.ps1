Write-Host "=== 1. LOGIN ===" -ForegroundColor Cyan

$loginBody = @{
    email = "admin@traffic.com"
    password = "admin123"
} | ConvertTo-Json

$login = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method POST -ContentType "application/json" -Body $loginBody
$global:headers = @{Authorization="Bearer $($login.token)"}
Write-Host "Token obtenido" -ForegroundColor Green

Write-Host "`n=== 2. LISTAR EMERGENCIAS ===" -ForegroundColor Cyan
try {
    $emergencias = Invoke-RestMethod -Uri "http://localhost:3000/api/emergencias" -Method GET -Headers $global:headers
    Write-Host "Total: $($emergencias.Count)" -ForegroundColor Green
    $emergencias | ForEach-Object { Write-Host "  ID: $($_.id) - $($_.tipo) - $($_.estado)" }
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== 3. CREAR EMERGENCIA EN OCANA ===" -ForegroundColor Cyan

$emergencias = @(
    @{ interseccion_id = 1; tipo = "ambulancia"; descripcion = "Ambulancia trasladando paciente al Hospital Emiro Quintero"; estado = "activa" },
    @{ interseccion_id = 1; tipo = "bomberos"; descripcion = "Bomberos atendiendo incendio en el centro de Ocana"; estado = "activa" },
    @{ interseccion_id = 1; tipo = "policia"; descripcion = "Patrulla de policia en el Parque Principal"; estado = "activa" }
)

$emergenciasCreadas = @()
foreach ($emergencia in $emergencias) {
    $body = $emergencia | ConvertTo-Json
    try {
        $created = Invoke-RestMethod -Uri "http://localhost:3000/api/emergencias" -Method POST -Headers $global:headers -ContentType "application/json" -Body $body
        Write-Host "Emergencia creada: ID $($created.emergencia.id) - $($created.emergencia.tipo)" -ForegroundColor Green
        $emergenciasCreadas += $created.emergencia.id
    } catch {
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n=== 4. OBTENER EMERGENCIA POR ID ===" -ForegroundColor Cyan
try {
    $emergencia = Invoke-RestMethod -Uri "http://localhost:3000/api/emergencias/1" -Method GET -Headers $global:headers
    $emergencia | ConvertTo-Json -Depth 5
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== 5. ACTUALIZAR EMERGENCIA ===" -ForegroundColor Cyan
$updateData = @{
    estado = "resuelta"
    descripcion = "Ambulancia llego al hospital sin novedad"
} | ConvertTo-Json

try {
    $updated = Invoke-RestMethod -Uri "http://localhost:3000/api/emergencias/1" -Method PUT -Headers $global:headers -ContentType "application/json" -Body $updateData
    Write-Host "Emergencia actualizada:" -ForegroundColor Green
    Write-Host "  Estado: $($updated.emergencia.estado)"
    Write-Host "  Resuelto: $($updated.emergencia.resuelto_at)"
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== 6. EMERGENCIAS ACTIVAS ===" -ForegroundColor Cyan
try {
    $activas = Invoke-RestMethod -Uri "http://localhost:3000/api/emergencias/activas" -Method GET -Headers $global:headers
    Write-Host "Total activas: $($activas.Count)" -ForegroundColor Green
    $activas | ForEach-Object { Write-Host "  ID: $($_.id) - $($_.tipo) - $($_.descripcion)" }
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== 7. EMERGENCIAS POR INTERSECCION ===" -ForegroundColor Cyan
try {
    $porInterseccion = Invoke-RestMethod -Uri "http://localhost:3000/api/emergencias/interseccion/1" -Method GET -Headers $global:headers
    Write-Host "Total: $($porInterseccion.Count)" -ForegroundColor Green
    $porInterseccion | ForEach-Object { Write-Host "  ID: $($_.id) - $($_.tipo) - $($_.estado)" }
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== 8. ELIMINAR EMERGENCIA ===" -ForegroundColor Cyan
try {
    $deleted = Invoke-RestMethod -Uri "http://localhost:3000/api/emergencias/3" -Method DELETE -Headers $global:headers
    Write-Host "Emergencia eliminada: ID $($deleted.emergencia.id) - $($deleted.emergencia.tipo)" -ForegroundColor Green
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}