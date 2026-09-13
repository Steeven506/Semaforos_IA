Write-Host "=== REGISTRANDO USUARIO ===" -ForegroundColor Cyan

$body = @{
    email = "test@test.com"
    password = "123456"
    nombre = "Test"
    apellido = "User"
} | ConvertTo-Json

try {
    $register = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/register" -Method POST -ContentType "application/json" -Body $body
    Write-Host "Usuario registrado:" -ForegroundColor Green
    $register | ConvertTo-Json -Depth 5
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== INICIANDO SESION ===" -ForegroundColor Cyan

$loginBody = @{
    email = "test@test.com"
    password = "123456"
} | ConvertTo-Json

try {
    $login = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method POST -ContentType "application/json" -Body $loginBody
    Write-Host "Login exitoso:" -ForegroundColor Green
    $login | ConvertTo-Json -Depth 5
    $global:token = $login.token
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== OBTENIENDO PERFIL ===" -ForegroundColor Cyan

try {
    $profile = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/profile" -Method GET -Headers @{Authorization="Bearer $global:token"}
    Write-Host "Perfil:" -ForegroundColor Green
    $profile | ConvertTo-Json -Depth 5
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}