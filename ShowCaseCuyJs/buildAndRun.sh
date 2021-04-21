#!/bin/sh
mvn clean package && docker build -t domolin/ShowCaseCuyJs .
docker rm -f ShowCaseCuyJs || true && docker run -d -p 9080:9080 -p 9443:9443 --name ShowCaseCuyJs domolin/ShowCaseCuyJs