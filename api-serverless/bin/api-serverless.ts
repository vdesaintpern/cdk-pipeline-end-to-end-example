#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ApiServerlessPipelineStack } from './api-serverless-pipeline-stack';

const deploymentAccount  = { account: '<account-id>', region: '<region-code>' };

const app = new cdk.App();

new ApiServerlessPipelineStack(app, "ApiServerlessPipeline", { env: deploymentAccount });