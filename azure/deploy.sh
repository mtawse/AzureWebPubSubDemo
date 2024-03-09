#!/bin/bash

cd "$(dirname "${BASH_SOURCE[0]}")"

az deployment sub create \
  --name webPubSubDemoDeployemnt \
  --location uksouth \
  --template-file resourceGroup.bicep \
  --parameters resourceGroupName=$1 resourceGroupLocation=uksouth

az deployment group create \
   --name webPubSubDemoDeployemntGroup \
   --resource-group $1 \
   --template-file webPubSub.bicep


echo "PUBSUB_DOMAIN"
pubSubDomain=$(az deployment group show \
  -g $1 \
  -n webPubSubDemoDeployemntGroup \
  --query properties.outputs.hostname.value)

echo "PUBSUB_SECRET"
pubSubSecret=$(az deployment group show \
  -g $1 \
  -n webPubSubDemoDeployemntGroup \
  --query properties.outputs.accessKey.value)


echo "Export the following environment variables"
echo "export PUBSUB_DOMAIN=$pubSubDomain"
echo "export PUBSUB_SECRET=$pubSubSecret"