#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CdkExampleAwsWafStack } from '../lib/cdk-example-aws-waf-stack';

const app = new cdk.App();
new CdkExampleAwsWafStack(app, 'CdkExampleAwsWafStack', {
  env: {
    region: 'us-east-1',
  },
});