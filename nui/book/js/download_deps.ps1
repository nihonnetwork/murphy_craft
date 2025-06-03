# URLs das dependências
$jqueryUrl = "https://code.jquery.com/jquery-3.6.0.min.js"
$turnjsUrl = "https://raw.githubusercontent.com/blasten/turn.js/master/turn.min.js"

# Diretório de destino
$jsDir = $PSScriptRoot

# Download jQuery
Write-Host "Baixando jQuery..."
Invoke-WebRequest -Uri $jqueryUrl -OutFile "$jsDir/jquery.min.js"

# Download Turn.js
Write-Host "Baixando Turn.js..."
Invoke-WebRequest -Uri $turnjsUrl -OutFile "$jsDir/turn.min.js"

Write-Host "Download concluído!" 