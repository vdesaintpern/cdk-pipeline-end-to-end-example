import * as cdk from 'aws-cdk-lib';
import { StageProps } from 'aws-cdk-lib';
import { Construct } from "constructs";
import { ApiServerlessStack } from '../lib/api-serverless-stack';

const deploymentAccount  = { account: '<account-id>', region: '<region-code>' };

interface ApiServerlessStageProps extends StageProps {
    // will be set when instanciating stage
    readonly envName: string;
}

export class ApiServerlessPipelineAppStage extends cdk.Stage {
    
    constructor(scope: Construct, id: string, props: ApiServerlessStageProps) {
        super(scope, id, props);

        const apiECSStack = new ApiServerlessStack(this, 'ApiServerlessStack-' + props.envName, { envName : props.envName, env: deploymentAccount});
    }
}