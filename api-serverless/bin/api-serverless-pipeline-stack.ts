import { Stack, StackProps } from 'aws-cdk-lib';
import { Repository } from 'aws-cdk-lib/aws-codecommit';
import { CodePipeline, CodePipelineSource, ManualApprovalStep, ShellStep } from 'aws-cdk-lib/pipelines';
import { Construct } from 'constructs';
import { ApiServerlessPipelineAppStage } from './api-serverless-stage';

export class ApiServerlessPipelineStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const pipeline = new CodePipeline(this, 'Pipeline', {
            pipelineName: 'APISERVERLESSCI',
            synth: new ShellStep('Synth', {
                input: CodePipelineSource.codeCommit(Repository.fromRepositoryName(this, 'monorepo', 
                'workshop-webapp-sandbox-to-production'), 'main'),
                commands: [
                    'cd api-serverless',
                    'npm ci', 
                    'npm run build',
                    'npx cdk synth', 
                    'cp -R cdk.out ../']
            })
        });

        const devStage = pipeline.addStage(new ApiServerlessPipelineAppStage(this, "api-serverless-dev", { envName: 'dev' }));

        const qaStage = pipeline.addStage(new ApiServerlessPipelineAppStage(this, "api-serverless-qa", { envName: 'qa' }));

        const prodStage = pipeline.addStage(new ApiServerlessPipelineAppStage(this, "api-serverless-prod", { envName: 'prod' }), {
            pre: [
                new ManualApprovalStep('PromoteToProd'),
            ]
        });

    }
}
