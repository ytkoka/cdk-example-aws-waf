# CDK example for AWS WAF
This CDK template will deploy a WebACL that includes the baseline rule group of AWS managed rules and a rate-based rule. Also, create a CloudWatch logs group and CloudWatch dashboard for AWS WAF.

WebACL includes the following rules set as COUNT mode:
* [Core rule set (CRS) managed rule group](https://docs.aws.amazon.com/waf/latest/developerguide/aws-managed-rule-groups-baseline.html#aws-managed-rule-groups-baseline-crs)
* [Known bad inputs managed rule group](https://docs.aws.amazon.com/waf/latest/developerguide/aws-managed-rule-groups-baseline.html#aws-managed-rule-groups-baseline-known-bad-inputs)
* [Rate-based rule for All requests](https://docs.aws.amazon.com/waf/latest/developerguide/waf-rule-statement-type-rate-based.html)

CloudWatch dashboard is created by the [CloudFormation template](cw-waf-dashboard-cloudfront.yaml) in the CDK. the dashboard includes the following widgets:
* Allowed vs Blocked Requests
* All Counted Requests
* Top Terminating Rules
* Top Countries
* Top User-agents
* Blocked requests by Rate based rule (Require Rate-based rule)
* Top Counted URIs
* Top Blocked URIs
* Counted Requests
* Blocked Requests

## Prerequisites
- AWS profile configured
- AWS CDK installed [see here for instructions](https://docs.aws.amazon.com/cdk/latest/guide/home.html)

## How to deploy

Run 

```
npm install
cdk bootstrap -c webaclName={Your WebACL name} 
cdk deploy -c webaclName={Your WebACL name}  
```

##  Cleanup

Before removing the stack, you will need to disassociate the AWS resource from WebACL manually.

Run

```
cdk destroy -c webaclName={Your WebACL name}
```