# CDK example for AWS WAF
This CDK template will deploy a WebACL that includes the baseline rule group of AWS managed rules and a rate-based rule as COUNT mode. Also, create CloudWatch logs for AWS WAF as the destination of AWS WAF logs.

WebACL includes the following rules as COUNT mode:
* [Core rule set (CRS) managed rule group](https://docs.aws.amazon.com/waf/latest/developerguide/aws-managed-rule-groups-baseline.html#aws-managed-rule-groups-baseline-crs)
* [Known bad inputs managed rule group](https://docs.aws.amazon.com/waf/latest/developerguide/aws-managed-rule-groups-baseline.html#aws-managed-rule-groups-baseline-known-bad-inputs)
* [Rate-based rule for All requests](https://docs.aws.amazon.com/waf/latest/developerguide/waf-rule-statement-type-rate-based.html)


## Prerequisites
- AWS profile configured
- AWS CDK installed [see here for instructions](https://docs.aws.amazon.com/cdk/latest/guide/home.html)

## How to deploy

Run 

```
cdk bootstrap
cdk deploy -c webaclName={Your WebACL name}  
```

##  Cleanup

Before removing the stack, you will need to disassociate the AWS resource from WebACL manually.

Run

```
cdk destroy
```