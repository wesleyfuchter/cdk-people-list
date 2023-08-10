#!/usr/bin/env node

const cdk = require('aws-cdk-lib');
const { ExampleContentDeliveryNetworkStack } = require('../lib/example-content-delivery-network-stack');

if (!process.env.NAMESPACE) {
    throw new Error('NAMESPACE environment variable is required');
}

const app = new cdk.App();
new ExampleContentDeliveryNetworkStack(app, `example-content-delivery-network-stack-${process.env.NAMESPACE}`, {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION,
    }
});
