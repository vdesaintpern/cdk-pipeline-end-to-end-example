import { Stack, StackProps } from 'aws-cdk-lib';
import { Repository } from 'aws-cdk-lib/aws-codecommit';
import { CodePipeline, CodePipelineSource, ManualApprovalStep, ShellStep } from 'aws-cdk-lib/pipelines';
import { Construct } from 'constructs';
import { ApiEcsPipelineAppStage } from './api-ecs-stage';

export class ApiEcsPipelineStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

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

    }
}
