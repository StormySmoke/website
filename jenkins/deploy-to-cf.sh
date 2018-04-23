#!/usr/bin/env bash
#
# Deploy app to Cloud Foundry on IBM Cloud. This can be used for deploying to
# both, the dev and prod environment, just the 'app' and 'rabbitmq-uri' params
# must be set accordingly.
#
# Usage:
#    deploy-to-cf.sh <app> <user> <password> <rabbitmq-uri>
#------------------------------------------------------------------------------#

if [[ $# -ne 4 ]]; then
  echo "Usage: $(basename $0) <app> <user> <password> <rabbitmq-uri>" && exit 1
fi

app=$1
user=$2
password=$3
rabbitmq_uri=$4

# Hardcoded parameters
api=https://api.us-east.bluemix.net
org=QuantumSense
space="Default Space"

cf login -a "$api"  -u "$user" -p "$password" -o "$org" -s "$space"
cf push
cf set-env "$app" RABBITMQ_URI "$rabbitmq_uri"
