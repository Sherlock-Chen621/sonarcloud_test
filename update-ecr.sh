$(aws ecr get-login --no-include-email --region us-east-1)
docker build -t bitspawn-backend-steam .
docker tag bitspawn-backend-steam:latest :latest
docker push :latest
