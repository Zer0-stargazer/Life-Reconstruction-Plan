@echo off
setlocal enabledelayedexpansion
title LIFE SANDBOX - DEV :5000
cd /d "%~dp0"

echo.
echo  ==========================================
echo    LIFE SANDBOX   DEV SERVER
echo    http://localhost:5000
echo  ==========================================
echo.

where pnpm >nul 2>nul
if errorlevel 1 (
  echo  [X] pnpm not found.
  echo      Install Node.js 20.9+ first, then run: npm install -g pnpm
  echo.
  pause
  exit /b 1
)

if not exist "node_modules" (
  echo  [1/4] First run - installing dependencies, this takes several minutes...
  call pnpm install
  if errorlevel 1 (
    echo.
    echo  [X] Install failed. Check your network and try again.
    pause
    exit /b 1
  )
) else (
  echo  [1/4] Dependencies OK.
)

if exist ".env.local" (
  echo  [2/4] Found .env.local
) else (
  echo  [2/4] WARNING - no .env.local found.
  echo        Login / AI / cloud sync will NOT work without it.
  echo        To create it, run this in the project folder:
  echo            copy .env.example .env.local
)

REM ---------- auto-detect local proxy ----------
REM Why: when Clash/V2Ray runs in TUN mode it hijacks direct connections and
REM resets TLS to some hosts (e.g. *.supabase.co), which shows up in the app as
REM "fetch failed" -> HTTP 500 on login. Routing Node through the local proxy
REM port fixes it. Node ignores HTTPS_PROXY unless NODE_USE_ENV_PROXY=1 (Node 24+).
set "PROXYPORT="
for %%p in (7897 7890 7899 7891 10809 10808 1080 2080 8889 8888) do (
  if not defined PROXYPORT (
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":%%p " ^| findstr "LISTENING"') do (
      if not defined PROXYPORT set "PROXYPORT=%%p"
    )
  )
)

if defined PROXYPORT (
  set "HTTP_PROXY=http://127.0.0.1:!PROXYPORT!"
  set "HTTPS_PROXY=http://127.0.0.1:!PROXYPORT!"
  set "http_proxy=http://127.0.0.1:!PROXYPORT!"
  set "https_proxy=http://127.0.0.1:!PROXYPORT!"
  set "NO_PROXY=localhost,127.0.0.1,::1"
  set "no_proxy=localhost,127.0.0.1,::1"
  set "NODE_USE_ENV_PROXY=1"
  echo  [3/4] Proxy found on port !PROXYPORT! - Node will route through it.
  for /f "tokens=1 delims=." %%v in ('node -v') do set "NODEMAJOR=%%v"
  set "NODEMAJOR=!NODEMAJOR:v=!"
  if !NODEMAJOR! LSS 24 (
    echo        WARNING: Node !NODEMAJOR! does not support NODE_USE_ENV_PROXY.
    echo        If login still fails, upgrade to Node 24 LTS or newer.
  )
) else (
  echo  [3/4] No local proxy detected - using direct connection.
)

REM ---------- port 5000 ----------
set "BUSY="
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5000 " ^| findstr "LISTENING"') do (
  if not defined BUSY set "BUSY=%%a"
)

if defined BUSY (
  echo.
  echo  [WARN] Port 5000 is already in use by PID !BUSY!
  echo         A leftover dev server is the usual reason the page will not open.
  echo.
  set /p "KILL=         Kill it and continue? [Y/N] "
  if /i "!KILL!"=="Y" (
    taskkill /F /PID !BUSY! >nul 2>nul
    echo         Port released.
  ) else (
    echo         Cancelled - close the other server yourself, then rerun.
    pause
    exit /b 1
  )
)

echo  [4/4] Starting. First compile takes 5-20 seconds.
echo.
echo  -----------------------------------------------------------
echo    To stop the server: press Ctrl + C in this window
echo  -----------------------------------------------------------
echo.

start "" /min cmd /c "timeout /t 12 >nul & start http://localhost:5000"

call pnpm dev

echo.
echo  Server stopped.
pause
