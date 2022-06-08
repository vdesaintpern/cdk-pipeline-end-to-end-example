import * as cdk from 'aws-cdk-lib';
import { StageProps } from 'aws-cdk-lib';
import { Construct } from "constructs";
import { ApiEcsStack } from '../lib/api-ecs-stack';

const deploymentAccount  = { account: '<account-id>', region: '<region-code>' };

interface ApiEcsStageProps extends StageProps {
    // will be set when instanciating stage
    readonly envName: string;
}

export class ApiEcsPipelineAppStage extends cdk.Stage {
    
    constructor(scope: Construct, id: string, props: ApiEcsStageProps) {
        super(scope, id, props);

        const apiECSStack = new ApiEcsStack(this, 'ApiEcsStack-' + props.envName, { envName : props.envName, env: deploymentAccount});
    }
}