# Serverless API

Serverless API leveraging AWS services.

## Instructions:
- Create an API that will allow me to store an address for a given user ID
- The endpoint should be secured by a simple API key
- Create another endpoint that returns all addresses for a given user ID. It should also take some optional parameters to filter by suburb and postcode.


## Requirements:
- You can use any AWS SDKs or libraries for interacting with AWS services.
- You can use any NPM packages or libraries as necessary.
- Leverage AWS services
- Code should be written in NodeJS and Typescript
- Deployment should leverage CDK
- Code to be stored in a Github account
- Instructions on how to deploy to our AWS account
- Document how you would improve the service to make it production ready.
- Add comments on what improvements could be made

## Setup and Test

### Pre-requisities
- Node 18.x: Preferably 18.16.0, instructions [here](https://nodejs.org/en/download)
  - Can use [Volta](https://volta.sh/) if having multiple node versions
- PNPM: Follow instructions [here](https://pnpm.io/installation)
- AWS account: An IAM user with programattic access
- Create a DYNAMODB table
```
TABLE
Address
Partition key - id

GSI
userId-index	
Partition key - userId 
```
- Create a DYNAMODB table
- run the CDK scripts to set up the infrastructure

### Local Testing
- Create new file `.env` based on .env.sample and enter your AWS credentials
- change the handler in lambda.ts
  ```js
  const response = await handler(EVENTS.getAddress, {} as Context); 
  ```
- pnpm i
- hit F5 in vscode to run in local

### Deployment ??
- Run CDK to deploy infrastructure
- Commit and push to github, 
  - Make sure all secrets are entered in Github
  - Github Actions will deploy to appropriate aws account
  - Github actions files is located at `.github/workflows/deploy.yaml`
