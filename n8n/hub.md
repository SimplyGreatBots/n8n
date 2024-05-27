
# N8N Integration

## What it is

A simply great integration to connect N8N to your Botpress Bot. N8N is an open-source workflow automation tool that allows you to automate tasks. It provides a visual interface where you can create and manage workflows using a wide range of pre-built nodes.

## How it works

Sending Events:  You can use the Activate Workflow action to trigger a webhook URL inside of one of your N8N workflows. You must provide a webhook url and JSON payload.
Receiving Events: You can receive events using the N8N event trigger and your Webhook URL provided in the integration settings. To receieve events you must first pass over your conversation id using {{event.conversationId}} in Activate Workflow. 

Data for N8N must follow the below JSON Object format:

`{
    "conversation": {
        "id": "CONVERSATION_ID_HERE"
    },
    "data": {
        YOUR_DATA_HERE
    }
}`

You can see the full integration code at: [GitHub - SimplyGreatBots/N8N](https://github.com/SimplyGreatBots/n8n)

## Tutorial Video
[![image](https://i.imgur.com/DKOBmlR.png)](https://www.youtube.com/watch?v=8YApyJUIqJs)

## Pre-requisites

This integration only requires a free N8N account.

## Botpress Setup

1. Click Install on the top right and select your bot.
2. Click the popup that appears to configure your integration.
3. Click your icon in the top right of your Botpress dasboard account and select "Personal Access Tokens".
4. Click 'Generate Access Token' and give it a name. Store this token somewhere safe as you weill need it in the N8N setup.
5. Copy and past the access token generated into the `Access Token` field in the N8N integration setup.
6. Enable and save the integration.

## N8N Setup

1. Go to your N8N workspace and navigate to Credentials -> Add credential.
2. Create a Header Authorization with the Name as "Authorization" and the Value as your Personal Access Token from the Botpress Setup section.