const { Stack, RemovalPolicy } = require('aws-cdk-lib');
const { Bucket } = require("aws-cdk-lib/aws-s3");
const { BucketDeployment, Source } = require("aws-cdk-lib/aws-s3-deployment");
const { Certificate } = require("aws-cdk-lib/aws-certificatemanager");
const { ViewerCertificate, CloudFrontWebDistribution } = require("aws-cdk-lib/aws-cloudfront");
const { ARecord, RecordTarget, HostedZone } = require("aws-cdk-lib/aws-route53");
const { CloudFrontTarget } = require("aws-cdk-lib/aws-route53-targets");

class ExampleContentDeliveryNetworkStack extends Stack {

  constructor(scope, id, props) {
    super(scope, id, props);

    const namespace = process.env.NAMESPACE;
    const domain = namespace === 'prod' ? 'wesleyfuchter.com' : `${namespace}.wesleyfuchter.com`;

    const websiteBucket = new Bucket(this, `website-bucket-${namespace}`, {
      websiteIndexDocument: 'index.html',
      publicReadAccess: true,
      blockPublicAccess: {
        blockPublicAcls: false,
        blockPublicPolicy: false,
        ignorePublicAcls: false,
        restrictPublicBuckets: false
      },
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    new BucketDeployment(this, `website-deployment-${namespace}`, {
      sources: [Source.asset('../ui/build')],
      destinationBucket: websiteBucket,
    });

    const certificate = Certificate.fromCertificateArn(this, `certificate-${namespace}`, 'arn:aws:acm:us-east-1:760736027183:certificate/a303a094-4098-43f1-87fc-a152bfe55d90');

    const distribution = new CloudFrontWebDistribution(this, `cloud-front-distribution-${namespace}`, {
      comment: `cloud-front-distribution-${namespace}`,
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: websiteBucket,
          },
          behaviors: [{ isDefaultBehavior: true }],
        },
      ],
      viewerCertificate: ViewerCertificate.fromAcmCertificate(certificate, {
        aliases: [domain],
      }),
    });

    new ARecord(this, `a-record-${namespace}`, {
      recordName: domain,
      target: RecordTarget.fromAlias(new CloudFrontTarget(distribution)),
      zone: HostedZone.fromLookup(this, 'Zone', { domainName: 'wesleyfuchter.com' }),
    });

  }

}

module.exports = { ExampleContentDeliveryNetworkStack }
