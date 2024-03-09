# Azure Web PubSub Demo

Demo app of websockets using Azure Web PubSub

## Setup

Create an Azure resource group with Web PUbSub

* install `az cli` and `bicep`
* `az login`

```
./azure/deploy.sh <resource-group-name>
```

After the resources have been created navigate to Azure portal and make a note of the Web PubSub host name and access key.

## Running the app

Set the host and access key environment variables then start the containers

```
export PUBSUB_DOMAIN=<pub-sub-domain>
export PUBSUB_SECRET=<pub-sub-access-key>

docker-compose up --build
```

Navigate to http://localhost to view the app.

Connect and send messages through Web PubSub