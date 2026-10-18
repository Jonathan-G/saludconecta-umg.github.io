<#
.SYNOPSIS
  Abre el sitio web del proyecto SaludConecta en este equipo.
.DESCRIPTION
  Inicia un servidor local (Node.js, sin instalar nada mas) y abre http://localhost:8080 en el navegador.
  Tambien puede abrir index.html con doble clic, pero asi no funciona la vista del Word dentro de la pagina.
.EXAMPLE
  .\Iniciar-Sitio.ps1
  .\Iniciar-Sitio.ps1 -Puerto 9000
#>
param([int]$Puerto = 8080, [switch]$SinNavegador)
$ErrorActionPreference = "Stop"
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "No se encontro Node.js. Instalelo desde https://nodejs.org o abra index.html con doble clic (sin la vista del Word)." -ForegroundColor Yellow
    Start-Process (Join-Path $PSScriptRoot "index.html")
    return
}
if (-not $SinNavegador) { Start-Process "http://localhost:$Puerto" }
node (Join-Path $PSScriptRoot "servir.js") $Puerto
