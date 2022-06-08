import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { InstanceClass, InstanceSize, InstanceType, Peer, Port, SecurityGroup, SubnetType, Vpc } from 'aws-cdk-lib/aws-ec2';
import { Credentials, DatabaseInstance, DatabaseInstanceEngine, MysqlEngineVersion } from 'aws-cdk-lib/aws-rds';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class InfraStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // VPC
    const vpc = new Vpc(this, "vpc-" + this.stackName, {
      // Same CIDR for all envs, choose different CIDR range if you plan to VPC peer them
      cidr: "10.0.0.0/20"
    });

    // allow all VPC - this is an example, you should allow only application servers
    const dbSecurityGroup = new SecurityGroup(this, 'db-security-group-' + this.stackName, {
      vpc: vpc,
      allowAllOutbound: true,
      description: 'security group for DB in ' + this.stackName
    })

    dbSecurityGroup.addIngressRule(
      Peer.ipv4('10.0.0.0/20'),
      Port.tcp(3306),
      'allow Mysql to all VPC do not do this at home',
    );

    // Small DB with MYSQL
    const dbSecretCredentials = Credentials.fromGeneratedSecret('admin');

    const instance = new DatabaseInstance(this, 'db-' + this.stackName, {
      engine: DatabaseInstanceEngine.mysql({ version: MysqlEngineVersion.VER_8_0_28 }),
      instanceType: InstanceType.of(InstanceClass.BURSTABLE3, InstanceSize.SMALL),
      credentials: dbSecretCredentials,
      vpc,
      vpcSubnets: {
        subnetType: SubnetType.PRIVATE_WITH_NAT,
      },
      securityGroups: [ dbSecurityGroup ]
    });

    // Export VPC ID
    const cfnVpcId = new CfnOutput(this, "VpcName-" + this.stackName, {
      value: vpc.vpcId,
      exportName: "vpc-" + this.stackName
    });

    // Export secret name
    const cfnDbSecret = new CfnOutput(this, "DbSecretName-" + this.stackName, {
      value: instance.secret!.secretName,
      exportName: "db-secret-name-" + this.stackName
    });

  }
}
