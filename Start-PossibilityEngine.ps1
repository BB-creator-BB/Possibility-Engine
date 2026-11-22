<#
.SYNOPSIS
    Starts The Possibility Engine Next.js dev server and opens it in your default browser.
#>

$ErrorActionPreference = 'Stop'

try {
    $ProjectDir = 'C:\Users\bostj\.gemini\antigravity\scratch\possibility-engine'
    $Port       = 3000
    $Url        = "http://localhost:$Port"

    if (-not (Test-Path -Path $ProjectDir)) {
        throw "Project directory not found: $ProjectDir"
    }

    # Ensure Node.js is on PATH even in freshly opened shells
    $NodeDir = 'C:\Program Files\nodejs'
    if ((Test-Path -Path $NodeDir) -and ($env:PATH -notlike "*$NodeDir*")) {
        $env:PATH = "$NodeDir;$env:PATH"
    }

    $NpmCmd = Join-Path $NodeDir 'npm.cmd'
    if (-not (Test-Path -Path $NpmCmd)) {
        $NpmCmd = 'npm.cmd'
    }

    Set-Location -Path $ProjectDir
    $Host.UI.RawUI.WindowTitle = 'The Possibility Engine - Dev Server'

    # Check if the server is already running on the target port
    $alreadyRunning = $false
    try {
        $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 2
        if ($response.StatusCode -ge 200 -and $response.StatusCode -lt 500) {
            $alreadyRunning = $true
        }
    } catch {
        $alreadyRunning = $false
    }

    if ($alreadyRunning) {
        Write-Host "The Possibility Engine is already running at $Url" -ForegroundColor Cyan
        Write-Host 'Opening browser...' -ForegroundColor Green
        Start-Process $Url
        Start-Sleep -Seconds 2
        exit 0
    }

    # Install dependencies automatically if node_modules is missing
    if (-not (Test-Path -Path (Join-Path $ProjectDir 'node_modules'))) {
        Write-Host 'node_modules not found - running npm install...' -ForegroundColor Yellow
        & $NpmCmd install
    }

    Write-Host '======================================================' -ForegroundColor DarkCyan
    Write-Host '  The Possibility Engine - Starting Dev Server' -ForegroundColor Cyan
    Write-Host "  URL: $Url" -ForegroundColor Gray
    Write-Host '  Press Ctrl+C to stop the server.' -ForegroundColor DarkGray
    Write-Host '======================================================' -ForegroundColor DarkCyan
    Write-Host ''

    # Spawn a lightweight watcher using -EncodedCommand to avoid any quoting issues
    $watcherCode = "for (`$i = 0; `$i -lt 90; `$i++) { Start-Sleep -Milliseconds 500; try { `$r = Invoke-WebRequest -Uri '$Url' -UseBasicParsing -TimeoutSec 2; if (`$r.StatusCode -ge 200 -and `$r.StatusCode -lt 500) { Start-Process '$Url'; break } } catch {} }"
    $encodedWatcher = [Convert]::ToBase64String([Text.Encoding]::Unicode.GetBytes($watcherCode))

    Start-Process -FilePath 'powershell.exe' -WindowStyle Hidden -ArgumentList @(
        '-NoProfile',
        '-ExecutionPolicy', 'Bypass',
        '-EncodedCommand', $encodedWatcher
    )

    # Run Next.js dev server in the foreground so live logs stay visible and Ctrl+C stops it cleanly
    & $NpmCmd run dev -- -p $Port
} catch {
    Write-Host ''
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ''
    Read-Host 'Press Enter to close'
    exit 1
}
