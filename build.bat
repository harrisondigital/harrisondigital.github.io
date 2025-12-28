@echo off
REM Copy relevant site files to dist folder for deployment

REM Clean dist folder
if exist dist rmdir /s /q dist
mkdir dist

REM Copy HTML files
copy *.html dist\

REM Copy CSS, JS, and images folders recursively
xcopy css dist\css /E /I /Y
xcopy js dist\js /E /I /Y
xcopy images dist\images /E /I /Y

REM Exclude dev files (README.md, LICENSE, etc.)
REM Add more exclusions as needed

echo Deployment files copied to dist\