Write-Host "=== 1. LOGIN ===" -ForegroundColor Cyan

$loginBody = @{
    email = "admin@traffic.com"
    password = "admin123"
} | ConvertTo-Json

$login = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method POST -ContentType "application/json" -Body $loginBody
$global:token = $login.token
$global:headers = @{Authorization="Bearer $global:token"}

Write-Host "Token obtenido" -ForegroundColor Green
Write-Host "Role en token: $($login.user.role_id)" -ForegroundColor Yellow

Write-Host "`n=== 2. LISTAR INTERSECCIONES ===" -ForegroundColor Cyan
try {
    $intersections = Invoke-RestMethod -Uri "http://localhost:3000/api/intersections" -Method GET -Headers $global:headers
    Write-Host "Total: $($intersections.Count)" -ForegroundColor Green
    $intersections | ForEach-Object { Write-Host "  ID: $($_.id) - $($_.nombre)" }
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== 3. CREAR INTERSECCION ===" -ForegroundColor Cyan
$newIntersection = @{
    nombre = "Interseccion Centro"
    descripcion = "Cruce de la Av. Central con Calle 50"
    latitud = 4.6097
    longitud = -74.0817
    direccion = "Av. Central #50-20"
    ciudad = "Bogota"
    pais = "Colombia"
} | ConvertTo-Json

try {
    $created = Invoke-RestMethod -Uri "http://localhost:3000/api/intersections" -Method POST -Headers $global:headers -ContentType "application/json" -Body $newIntersection
    Write-Host "Interseccion creada:" -ForegroundColor Green
    Write-Host "  ID: $($created.intersection.id) - $($created.intersection.nombre)"
    $global:newId = $created.intersection.id
    Write-Host "  newId guardado: $global:newId" -ForegroundColor Yellow
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

if ($global:newId) {
    Write-Host "`n=== 4. OBTENER INTERSECCION POR ID: $global:newId ===" -ForegroundColor Cyan
    try {
        $intersection = Invoke-RestMethod -Uri "http://localhost:3000/api/intersections/$global:newId" -Method GET -Headers $global:headers
        Write-Host "Interseccion obtenida:" -ForegroundColor Green
        $intersection | ConvertTo-Json -Depth 5
    } catch {
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    }

    Write-Host "`n=== 5. ACTUALIZAR INTERSECCION ===" -ForegroundColor Cyan
    $updateData = @{
        nombre = "Interseccion Centro Actualizada"
        ciudad = "Medellin"
    } | ConvertTo-Json

    try {
        $updated = Invoke-RestMethod -Uri "http://localhost:3000/api/intersections/$global:newId" -Method PUT -Headers $global:headers -ContentType "application/json" -Body $updateData
        Write-Host "Interseccion actualizada:" -ForegroundColor Green
        Write-Host "  Nombre: $($updated.intersection.nombre)"
        Write-Host "  Ciudad: $($updated.intersection.ciudad)"
    } catch {
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    }

    Write-Host "`n=== 6. ESTADISTICAS ===" -ForegroundColor Cyan
    try {
        $stats = Invoke-RestMethod -Uri "http://localhost:3000/api/intersections/$global:newId/stats" -Method GET -Headers $global:headers
        $stats | ConvertTo-Json -Depth 5
    } catch {
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    }

    Write-Host "`n=== 8. ELIMINAR INTERSECCION ===" -ForegroundColor Cyan
    try {
        $deleted = Invoke-RestMethod -Uri "http://localhost:3000/api/intersections/$global:newId" -Method DELETE -Headers $global:headers
        Write-Host "Interseccion eliminada:" -ForegroundColor Green
        Write-Host "  ID: $($deleted.intersection.id) - $($deleted.intersection.nombre)"
    } catch {
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "`nNo se pudo crear la interseccion, saltando pasos 4-8" -ForegroundColor Yellow
}

Write-Host "`n=== 7. MIS INTERSECCIONES ===" -ForegroundColor Cyan
try {
    $myIntersections = Invoke-RestMethod -Uri "http://localhost:3000/api/intersections/my" -Method GET -Headers $global:headers
    Write-Host "Total: $($myIntersections.Count)" -ForegroundColor Green
    $myIntersections | ForEach-Object { Write-Host "  ID: $($_.id) - $($_.nombre)" }
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}