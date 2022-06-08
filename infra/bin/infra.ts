#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { InfraStack } from '../lib/infra-stack';

const app = new cdk.App();

const envStack = app.node.tryGetContext('envName');

new InfraStack(app, 'InfraStack-' + envStack, {});