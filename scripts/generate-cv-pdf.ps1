param(
  [string]$InputPath = "..\print-cv.html",
  [string]$OutputPath = "..\Theodore_Nelson_CV_Upgraded.pdf"
)

$ErrorActionPreference = "Stop"

$browserCandidates = @(
  "C:\Program Files\Google\Chrome\Application\chrome.exe",
  "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
)

$browser = $browserCandidates | Where-Object { Test-Path $_ } | Select-Object -First 1

if (-not $browser) {
  throw "No supported browser found. Install Chrome or Edge to generate the PDF."
}

$resolvedInputPath = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot $InputPath))
$resolvedOutputPath = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot $OutputPath))
$profilePath = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot "..\.browser-print-profile"))
$inputUri = [System.Uri]::new($resolvedInputPath).AbsoluteUri

if (-not (Test-Path $resolvedInputPath)) {
  throw "Printable CV source not found at $resolvedInputPath"
}

if (-not (Test-Path $profilePath)) {
  New-Item -ItemType Directory -Path $profilePath | Out-Null
}

$arguments = @(
  '"--headless=new"',
  '"--disable-gpu"',
  '"--no-first-run"',
  '"--no-default-browser-check"',
  ('"--user-data-dir={0}"' -f $profilePath),
  '"--allow-file-access-from-files"',
  ('"--print-to-pdf={0}"' -f $resolvedOutputPath),
  ('"{0}"' -f $inputUri)
)

$process = Start-Process -FilePath $browser -ArgumentList ($arguments -join ' ') -Wait -PassThru -NoNewWindow

if ($process.ExitCode -ne 0) {
  throw "Browser export failed with exit code $($process.ExitCode)."
}

if (-not (Test-Path $resolvedOutputPath)) {
  throw "PDF was not generated at $resolvedOutputPath"
}

Write-Output "Generated PDF at $resolvedOutputPath"
