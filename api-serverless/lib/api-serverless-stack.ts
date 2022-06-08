import { Fn, Stack, StackProps } from 'aws-cdk-lib';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

interface ApiServerlessStackProps extends StackProps {
  readonly envName: string;
}

export class ApiServerlessStack extends Stack {
  constructor(scope: Construct, id: string, props: ApiServerlessStackProps) {
    super(scope, id, props);

    const dbSecretName = Fn.importValue('db-secret-name-InfraStack-' + props.envName);

    const handler = new Function(this, "apilambda-" + props.envName , {
      runtime: Runtime.NODEJS_14_X,
      code: Code.fromAsset("src"),
      handler: "index.handler",
      environment: {
        ENVNAME: props.envName,
        DB_SECRET_NAME: dbSecretName
      }
    });

    const api = new RestApi(this, "api-serverless-" + props.envName, {
      restApiName: "Api Serverless for " + props.envName,
      description: "this is a test"
    });

    const lambdaIntegration = new LambdaIntegration(handler, {
      requestTemplates: { "application/json": '{ "statusCode": "200" }' }
    });

    api.root.addMethod("GET", lambdaIntegration);
  }
}
