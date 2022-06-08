# Baseline for the workshop

This will create a VPC and a single small database.

This stack will have to be deployed 3 times.

The reason why it's separated from the rest is lifecycle / ownership : 
App will get quite a few iterations by developers while database and VPC will be managed by an lead / admin in general

## Create stacks

### Dev

cdk deploy --context envName=dev

### QA

cdk deploy --context envName=qa

### Production

cdk deploy --context envName=prod