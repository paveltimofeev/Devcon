@echo off
rem run unit tests and start server
mocha & set DEBUG=devconserver & node .\bin\www
