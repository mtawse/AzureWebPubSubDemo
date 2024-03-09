#!/bin/bash

cd "$(dirname "${BASH_SOURCE[0]}")"

az deployment sub create \
  --name demoSubDeployment \
  --location centralus \
  --template-file resourceGroup.bicep \
  --parameters resourceGroupName=$1 resourceGroupLocation=uksouth

az deployment group create --resource-group $1 --template-file webPubSub.bicep