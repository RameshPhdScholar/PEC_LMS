# PowerShell script to import credentials into the database
# Usage: .\src\db\import_credentials.ps1

# Check if MySQL is installed
try {
    $mysqlPath = (Get-Command mysql -ErrorAction Stop).Source
    Write-Host "MySQL found at: $mysqlPath"
} catch {
    Write-Host "MySQL not found. Please make sure MySQL is installed and added to your PATH." -ForegroundColor Red
    exit 1
}

# Default database credentials
$dbUser = "root"
$dbPassword = "root"
$dbName = "leave_management"

# Check if .env.local file exists and read credentials from it
$envFile = ".env.local"
if (Test-Path $envFile) {
    Write-Host "Reading database credentials from .env.local file..."
    $envContent = Get-Content $envFile
    
    foreach ($line in $envContent) {
        if ($line -match "DB_USER=(.+)") {
            $dbUser = $matches[1]
        }
        if ($line -match "DB_PASSWORD=(.+)") {
            $dbPassword = $matches[1]
        }
        if ($line -match "DB_NAME=(.+)") {
            $dbName = $matches[1]
        }
    }
}

# SQL file path
$sqlFile = "src\db\credentials_data.sql"
if (-not (Test-Path $sqlFile)) {
    Write-Host "SQL file not found at: $sqlFile" -ForegroundColor Red
    exit 1
}

# Import credentials
Write-Host "Importing credentials into the database..."
Write-Host "Database: $dbName"
Write-Host "User: $dbUser"

try {
    # Execute MySQL command
    $command = "mysql -u $dbUser -p$dbPassword $dbName < $sqlFile"
    
    # Use Invoke-Expression to execute the command
    Invoke-Expression "cmd /c $command"
    
    Write-Host "Credentials imported successfully!" -ForegroundColor Green
} catch {
    Write-Host "Error importing credentials: $_" -ForegroundColor Red
    exit 1
}
