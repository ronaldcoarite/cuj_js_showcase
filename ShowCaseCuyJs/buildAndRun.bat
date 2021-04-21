@echo off
call mvn clean package
call docker build -t domolin/ShowCaseCuyJs .
call docker rm -f ShowCaseCuyJs
call docker run -d -p 9080:9080 -p 9443:9443 --name ShowCaseCuyJs domolin/ShowCaseCuyJs