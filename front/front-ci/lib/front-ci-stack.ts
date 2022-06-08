import { CfnOutput, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { CloudFrontWebDistribution, Distribution, OriginProtocolPolicy, ViewerProtocolPolicy } from 'aws-cdk-lib/aws-cloudfront';
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Asset } from 'aws-cdk-lib/aws-s3-assets';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class FrontCiStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // S3 bucket for the code
    const myWebappBucket = new Bucket(this, "mywebapp-bucket-" + this.stackName, {
      bucketName: 'mywebapp-2649fghe28g-' + this.stackName.toLowerCase(),
      publicReadAccess: false,
      removalPolicy: RemovalPolicy.DESTROY
    })

    // Cloudfront distribution with link to S3 
    const myWebAppDistribution = new Distribution(this, 'mywebapp-distribution-' + this.stackName, {
      defaultBehavior: { 
        origin: new S3Origin(myWebappBucket),
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS
      },
      defaultRootObject: 'index.html',
    });

    const s3Deployment = new BucketDeployment(this, 'DeployWebsite', {
      sources: [Source.asset('../mywebapp/build')],
      destinationBucket: myWebappBucket
    });

    // export de l'url de cloudfront
    const cfnCloudFrontURL = new CfnOutput(this, "mywebapp-url-" + this.stackName, {
      value: myWebAppDistribution.distributionDomainName,
      exportName: "mywebapp-url-" + this.stackName
    });

  }
}
