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


pubSubHost=$(az deployment group show \
  -g $1 \
  -n webPubSubDemoDeployemntGroup \
  --query properties.outputs.hostname.value)

pubSubSecret=$(az deployment group show \
  -g $1 \
  -n webPubSubDemoDeployemntGroup \
  --query properties.outputs.accessKey.value)


echo "Export the following environment variables"
echo "export PUBSUB_HOST=$pubSubHost"
echo "export PUBSUB_SECRET=$pubSubSecret"