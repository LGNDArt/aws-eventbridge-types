# aws-eventbridge-types

## Why?
I was looking for a way to remove `event: any` from my Lambda event handlers.

With this you can write Lambdas like so instead:

```typescript
import types = require('./types/aws.s3')

exports.handler = async (event: types.AwsS3) => {
  // handler
}
```

## What else?

Enums aren't well-handled by quicktype and there's certainly going to be a substantial amount of overloading of event types that would be better broken out to more specific types per service, as well as extracting the general EventBridge wrapper common across all types.

But this is a decent start until something more sophisticated shows up.  Maybe AWS will expose the Smithy specs for EventBridge.

## How?

## from https://us-east-2.console.aws.amazon.com/events/home?region=us-east-2#/explore
```sh
wget https://d1rwx18vtoexio.cloudfront.net/static/1.0/events/AWSSampleEvents.json
```

## to generate a list of unique sources
```sh
cat AWSSampleEvents.json | jq '.[] | .source' -r | uniq > unique_sources.txt
```

## split by source
```sh
for source in $(cat unique_sources.txt); do cat AWSSampleEvents.json | jq '[.[] | select(.source == "'$source'")]' > ./sampleevents_by_source/$source.json; done
```

## generate types for all sample sources
```sh
for f in ./sampleevents_by_source/*.json; do quicktype -l typescript $f > ./types/$(basename $f .json).ts; done
```