Write-Host "=== PRUEBA DE WEBSOCKETS ===" -ForegroundColor Cyan
Write-Host "Este script abre una conexion WebSocket y escucha eventos" -ForegroundColor Yellow
Write-Host "Presiona Ctrl+C para salir" -ForegroundColor Yellow
Write-Host ""

$wsUrl = "ws://localhost:3000/socket.io/?EIO=4&transport=websocket"

try {
    $ws = New-Object System.Net.WebSockets.ClientWebSocket
    $uri = [System.Uri]$wsUrl
    $ct = [System.Threading.CancellationToken]::None
    $ws.ConnectAsync($uri, $ct).Wait()
    
    Write-Host "Conectado al WebSocket" -ForegroundColor Green
    
    $buffer = New-Object byte[] 4096
    $segment = New-Object System.ArraySegment[byte] -ArgumentList @(,$buffer)
    
    while ($ws.State -eq 'Open') {
        $result = $ws.ReceiveAsync($segment, $ct).Result
        $message = [System.Text.Encoding]::UTF8.GetString($buffer, 0, $result.Count)
        Write-Host "Mensaje recibido: $message" -ForegroundColor Cyan
    }
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}