#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { FrontCiPipelineStack } from './front-ci-pipeline-stack';

const app = new cdk.App();

new FrontCiPipelineStack(app, 'FrontCiPipelineStack', {});