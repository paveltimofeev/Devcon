@echo off
rem run unit tests and start server

mocha & set DEBUG=devconserver & set DEV=true & set PORT=3009 & node %~dp0\bin\www 
