@echo off
rem run unit tests and start server
call taskkill /T /F /FI "WINDOWTITLE eq DEVCONSERVER_01"

TITLE DEVCONSERVER_01
mocha & set DEBUG=devconserver & node .\bin\www 
rem >> logs\devcon.log
