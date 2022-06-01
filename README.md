# from https://us-east-2.console.aws.amazon.com/events/home?region=us-east-2#/explore

wget https://d1rwx18vtoexio.cloudfront.net/static/1.0/events/AWSSampleEvents.json

# to generate a list of unique sources
cat AWSSampleEvents.json | jq '.[] | .source' -r | uniq > unique_sources.txt

# split by source
for source in $(cat unique_sources.txt); do cat AWSSampleEvents.json | jq '[.[] | select(.source == "'$source'")]' > ./sampleevents_by_source/$source.json; done

# generate type by running it through https://app.quicktype.io/?l=ts