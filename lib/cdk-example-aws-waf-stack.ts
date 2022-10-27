import { Stack, StackProps, ArnFormat, RemovalPolicy } from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { CfnWebACL, CfnLoggingConfiguration } from 'aws-cdk-lib/aws-wafv2'
import { LogGroup, RetentionDays } from 'aws-cdk-lib/aws-logs'
import { CfnInclude } from 'aws-cdk-lib/cloudformation-include'

export class CdkExampleAwsWafStack extends Stack {
  constructor (scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const webaclName = this.node.tryGetContext('webaclName') as string
    if (webaclName == undefined) {
      throw new Error('Context value [webaclName] is not set')
    }
    // Create WebACL
    const webacl = new CfnWebACL(this, 'MyCfnWebACL', {
      scope: 'CLOUDFRONT',
      defaultAction: { allow: {} },
      name: webaclName,
      rules: [
        {
          priority: 0,
          name: 'AWS-AWSManagedRulesCommonRuleSet',
          statement: {
            managedRuleGroupStatement: {
              vendorName: 'AWS',
              name: 'AWSManagedRulesCommonRuleSet',
              excludedRules: [
                { name: 'NoUserAgent_HEADER' },
                { name: 'UserAgent_BadBots_HEADER' },
                { name: 'SizeRestrictions_QUERYSTRING' },
                { name: 'SizeRestrictions_Cookie_HEADER' },
                { name: 'SizeRestrictions_BODY' },
                { name: 'SizeRestrictions_URIPATH' },
                { name: 'EC2MetaDataSSRF_BODY' },
                { name: 'EC2MetaDataSSRF_COOKIE' },
                { name: 'EC2MetaDataSSRF_URIPATH' },
                { name: 'EC2MetaDataSSRF_QUERYARGUMENTS' },
                { name: 'GenericLFI_QUERYARGUMENTS' },
                { name: 'GenericLFI_URIPATH' },
                { name: 'GenericLFI_BODY' },
                { name: 'RestrictedExtensions_URIPATH' },
                { name: 'RestrictedExtensions_QUERYARGUMENTS' },
                { name: 'GenericRFI_QUERYARGUMENTS' },
                { name: 'GenericRFI_BODY' },
                { name: 'GenericRFI_URIPATH' },
                { name: 'CrossSiteScripting_COOKIE' },
                { name: 'CrossSiteScripting_QUERYARGUMENTS' },
                { name: 'CrossSiteScripting_BODY' },
                { name: 'CrossSiteScripting_URIPATH' }
              ]
            }
          },
          overrideAction: { none: {} },
          visibilityConfig: {
            sampledRequestsEnabled: true,
            cloudWatchMetricsEnabled: true,
            metricName: 'AWS-AWSManagedRulesCommonRuleSet'
          }
        },
        {
          priority: 1,
          name: 'AWS-AWSManagedRulesKnownBadInputsRuleSet',
          statement: {
            managedRuleGroupStatement: {
              vendorName: 'AWS',
              name: 'AWSManagedRulesKnownBadInputsRuleSet',
              excludedRules: [
                { name: 'Host_localhost_HEADER' },
                { name: 'Log4JRCE_BODY' },
                { name: 'Log4JRCE_URIPATH' },
                { name: 'Log4JRCE_HEADER' },
                { name: 'Log4JRCE_QUERYSTRING' },
                { name: 'PROPFIND_METHOD' },
                { name: 'ExploitablePaths_URIPATH' },
                { name: 'JavaDeserializationRCE_BODY' },
                { name: 'JavaDeserializationRCE_URIPATH' },
                { name: 'JavaDeserializationRCE_QUERYSTRING' },
                { name: 'JavaDeserializationRCE_HEADER' }
              ]
            }
          },
          overrideAction: { none: {} },
          visibilityConfig: {
            sampledRequestsEnabled: true,
            cloudWatchMetricsEnabled: true,
            metricName: 'AWS-AWSManagedRulesKnownBadInputsRuleSet'
          }
        },
        {
          priority: 2,
          name: 'Rate-based-rule-all-requests',
          action: { count: {} },
          statement: {
            rateBasedStatement: {
              aggregateKeyType: 'IP',
              limit: 1000
            }
          },
          visibilityConfig: {
            sampledRequestsEnabled: true,
            cloudWatchMetricsEnabled: true,
            metricName: 'Rate-based-rule-all-requests'
          }
        }
      ],
      visibilityConfig: {
        cloudWatchMetricsEnabled: true,
        metricName: webaclName,
        sampledRequestsEnabled: true
      }
    });
    // Create CloudWatch Dashboard from CFn template
    new CfnInclude(this, 'Template', {
      templateFile: 'cw-waf-dashboard-cloudfront.yaml',
      parameters: {
        webaclName: webaclName
      },
    });
    // Create Log group
    const aclLogGroup = new LogGroup(this, 'webACLLogs', {
      logGroupName: `aws-waf-logs-${webaclName}`,
      retention: RetentionDays.SIX_MONTHS,
      removalPolicy: RemovalPolicy.DESTROY
    });

    // Create logging configuration with log group as destination
    new CfnLoggingConfiguration(this, 'webAclLoggingConfiguration', {
      logDestinationConfigs: [
        // Construct the different ARN format from the logGroupName
        Stack.of(this).formatArn({
          arnFormat: ArnFormat.COLON_RESOURCE_NAME,
          service: 'logs',
          resource: 'log-group',
          resourceName: aclLogGroup.logGroupName
        })
      ],
      resourceArn: webacl.attrArn
    });
  }
}
