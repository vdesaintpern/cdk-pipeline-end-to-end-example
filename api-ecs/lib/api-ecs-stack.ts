import { Fn, Stack, StackProps } from 'aws-cdk-lib';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { DockerImageAsset } from 'aws-cdk-lib/aws-ecr-assets';
import { Cluster, ContainerImage } from 'aws-cdk-lib/aws-ecs';
import { ApplicationLoadBalancedFargateService } from 'aws-cdk-lib/aws-ecs-patterns';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';

interface ApiEcsStackProps extends StackProps {

  // will be set when instanciating stack
  readonly envName: string;

}

export class ApiEcsStack extends Stack {
  constructor(scope: Construct, id: string, props: ApiEcsStackProps) {
    super(scope, id, props);

    const vpc = Vpc.fromLookup(this, 'vpc-' + props.envName, { vpcName : 'InfraStack-' + props.envName + '/vpc-InfraStack-' + props.envName });

    const cluster = new Cluster(this, "Cluster-" + props.envName, {
      vpc,
    });

    const image = new DockerImageAsset(this, "API-image", {
      directory: "./src/",
    });

    const dbSecretName = Fn.importValue('db-secret-name-InfraStack-' + props.envName);

    const api = new ApplicationLoadBalancedFargateService(
      this,
      "API-" + props.envName,
      {
        cluster: cluster,
        cpu: 256,
        desiredCount: 2,
        listenerPort: 80,
        taskImageOptions: {
          image: ContainerImage.fromDockerImageAsset(image),
          containerPort: 80,          
          environment: {
            ENVNAME: props.envName,
            DB_SECRET_NAME: dbSecretName
          },
        },
        memoryLimitMiB: 512,
        publicLoadBalancer: true,
      }
    );

    const scalableTarget = api.service.autoScaleTaskCount({
      minCapacity: 2,
      maxCapacity: 10,
    });
    
    scalableTarget.scaleOnCpuUtilization('CpuScaling', {
      targetUtilizationPercent: 50,
    });
    
    scalableTarget.scaleOnMemoryUtilization('MemoryScaling', {
      targetUtilizationPercent: 50,
    });
  }
}
