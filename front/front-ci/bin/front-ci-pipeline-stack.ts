import { Stack, StackProps } from 'aws-cdk-lib';
import { Repository } from 'aws-cdk-lib/aws-codecommit';
import { CodePipeline, CodePipelineSource, ManualApprovalStep, ShellStep } from 'aws-cdk-lib/pipelines';
import { Construct } from 'constructs';
import { FrontCIPipelineAppStage } from './front-ci-stage';

export class FrontCiPipelineStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const pipeline = new CodePipeline(this, 'Pipeline', {
            pipelineName: 'FrontCI',
            synth: new ShellStep('Synth', {
                input: CodePipelineSource.codeCommit(Repository.fromRepositoryName(this, 'monorepo', 
                'workshop-webapp-sandbox-to-production'), 'main'),
                commands: [
                    'cd front/mywebapp',
                    'npm ci', 
                    'npm run build',
                    'cd ../front-ci', 
                    'npm ci', 
                    'npm run build', 
                    'npx cdk synth', 
                    'cp -R cdk.out ../../']
            })
        });

        const devStage = pipeline.addStage(new FrontCIPipelineAppStage(this, "frontci-dev"));

        const qaStage = pipeline.addStage(new FrontCIPipelineAppStage(this, "frontci-qa"));

        const prodStage = pipeline.addStage(new FrontCIPipelineAppStage(this, "frontci-prod"), {
            pre: [
                new ManualApprovalStep('PromoteToProd'),
            ],
        });

    }
}
