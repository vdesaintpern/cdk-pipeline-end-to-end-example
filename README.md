# End to end CDK Pipelines example for Webapp and Serverler / container API 

This repository covers examples of using CDK pipelines with :

- ReactJS application
- Serverless API with API Gateway and Lambda
- Container API based on ECS

## Benefits of using this example

You'll learn that using BucketDeployment, DockerImageAsset, Code.fromAsset and CDK Pipeline you can have on fully integrated CI/CD that will build the assets for you.

This means that with a few lines of code : 

- based on provided Dockerfile and source code : docker image will be built, sent to ECR, versioned and deployed in ECS for you
- based on ReactJS folder, zip file will be created based on npm build, sent to a S3 bucket and deployed for you
- based on src folder, code will be zipped, versioned and deployed for you

## BucketDeployment

Key file to look at : ./front/front-ci/front-ci.ts

```typescript
    const s3Deployment = new BucketDeployment(this, 'DeployWebsite', {
      sources: [Source.asset('../mywebapp/build')],
      destinationBucket: myWebappBucket
    });
```

![alt text](https://github.com/vdesaintpern/cdk-pipeline-end-to-end-example/blob/main/doc/js.png?raw=true)

## DockerImageAsset

Key file to look at : ./api-ecs/lib/api-ecs-stack.ts

```typescript
    const image = new DockerImageAsset(this, "API-image", {
      directory: "./src/",
    });
```
![alt text](https://github.com/vdesaintpern/cdk-pipeline-end-to-end-example/blob/main/doc/containers.png?raw=true)

## Code.fromAsset

Key file to look at : ./api-serverless/lib/api-serverless-stack.ts

```typescript
    const handler = new Function(this, "apilambda-" + props.envName , {
      runtime: Runtime.NODEJS_14_X,
      code: Code.fromAsset("src"),
      handler: "index.handler",
      environment: {
        ENVNAME: props.envName,
        DB_SECRET_NAME: dbSecretName
      }
    });
```
![alt text](https://github.com/vdesaintpern/cdk-pipeline-end-to-end-example/blob/main/doc/serverless.png?raw=true)

## CDK Pipeline

Key files to look at : 
./api-ecs/bin/api-ecs-pipeline-stack.ts
./api-serverless/bin/api-serverless-pipeline-stack.ts
./front/front-ci/bin/front-ci-pipeline-stack.ts

Example with api-ecs (refer to other files for specific examples, logic is similar)

```typescript
        const pipeline = new CodePipeline(this, 'Pipeline', {
            pipelineName: 'APIECSCI',
            synth: new ShellStep('Synth', {
                input: CodePipelineSource.codeCommit(Repository.fromRepositoryName(this, 'monorepo', 
                'workshop-webapp-sandbox-to-production'), 'main'),
                commands: [
                    'cd api-ecs',
                    'npm ci', 
                    'npm run build',
                    'npx cdk synth', 
                    'cp -R cdk.out ../']
            })
        });

        const devStage = pipeline.addStage(new ApiEcsPipelineAppStage(this, "api-ecs-dev", { envName: 'dev' }));

        const qaStage = pipeline.addStage(new ApiEcsPipelineAppStage(this, "api-ecs-qa", { envName: 'qa' }));

        const prodStage = pipeline.addStage(new ApiEcsPipelineAppStage(this, "api-ecs-prod", { envName: 'prod' }), {
            pre: [
                new ManualApprovalStep('PromoteToProd'),
            ]
        });
```

# Notes on deployment

If you want to deploy it yourself :

- deploy 3 env infra stacks with the right envName parameters : this will deploy a VPC + a database for each env out of free tier this will have some impact on billing and don't forget to delete it when you're done.
- deploy once each api-ecs / api-serverless / front stack as this will create one pipeline deploying to 3 environnements
- don't forget to change ```<account-id>``` and ```<region-code>``` to the appropriate values 

## Infrastructure stack

This stack usually different lifecycle than the others. So this one hasn't got a pipeline and is to be managed manually.  
For this example to work fully, you have to create 3 stacks : 1 for dev, 1 for QA, 1 for Production with appropriate envName

![alt text](https://github.com/vdesaintpern/cdk-pipeline-end-to-end-example/blob/main/doc/infra.png?raw=true)

## What can be improved

- Sample code to use the database secret in docker container / lambda
- Remove account number requirement in some stacks
- Example of cross account deployement, this is out-of-scope for now for the sake of simplicity / easier understanding

# Disclaimer

This code is for training purposes only and there is no garantee whatsoever. Use it at your own risk.

