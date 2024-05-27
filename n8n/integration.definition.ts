import { IntegrationDefinition, z } from '@botpress/sdk'
import { integrationName } from './package.json'
import { n8nWebhookEventSchema } from 'src/types'

export default new IntegrationDefinition({
  name: integrationName,
  title: 'N8N',
  description: 'This integration allows you to interact with N8N workflows.',
  version: '1.0.0',
  readme: 'hub.md',
  icon: 'icon.svg',
  configuration: {
    schema: z.object({
      accessToken: z.string().describe('A Botpress Access token. Generate this token from the Personal Access Tokens settings in your Botpress dashboard.'),
    })
  },
  actions: {
    activateWorkflow: {
      title: 'Activate Workflow',
      description: 'Activate a workflow in n8n.',
      input: {
        schema: z.object({
          conversationId: z.string().optional().describe('The ID of the conversation. Can be passed using event.conversationId. Can be used to send webhook events back to the conversation.'),
          webhookURL: z.string().describe('The Webhook URL of the n8n trigger.'),
          payload: z.string().describe('The payload to send to the n8n trigger as a JSON string payload.'),
        }),
      },
      output: {
        schema: z.object({}),
      },
    },
  },
  events: {
    n8nEvent: {
      title: 'N8N Event',
      description: 'Triggered when a webhook is received from n8n.',
      schema: n8nWebhookEventSchema
    },
  },
})
