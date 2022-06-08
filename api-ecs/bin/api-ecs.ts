#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ApiEcsPipelineStack } from './api-ecs-pipeline-stack';

const deploymentAccount  = { account: '<account-id>', region: '<region-code>' };

const app = new cdk.App();

new ApiEcsPipelineStack(app, "ApiEcsPipeline", { env: deploymentAccount });
