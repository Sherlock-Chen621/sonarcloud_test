# Hatch Digital Backend API

## To run
- Rename .env-TEMPLATE to .env
- npm install
- npm start

## For local testing
You can use authenticationForLocalTesting function in authentication.js

## Deploy
Local setup aws cli [AWS CLI setup documentation](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html)<br>
After git clone repo<br>
- Open a terminal
- command cd to hatch-digital-backend. example:  cd hatch-digital-backend
- view Readme and set .env file
- use command: bash update-ecr-prod.sh
- open AWS Console
- Open and switch to ECS
- Click the cluster button on the left side
- Click Hatch-digital-prod on the right side
- Click the task button
- Click the task you want to redeploy
- Click the stop button and wait for the task to restart