import * as sdk from '@botpress/sdk'
import * as bp from '.botpress'
import axios from 'axios'
import { n8nWebhookEventSchema } from './types'

export default new bp.Integration({
  register: async () => {},
  unregister: async () => {},
  actions: {
    activateWorkflow: async (args): Promise<{}> => {
      const accessToken = args.ctx.configuration.accessToken
      const conversationId = args.input.conversationId
      const webhookURL = args.input.webhookURL
      const payload = {
        conversation: {
          id: conversationId
        },
        data: args.input.payload
      }

      try {
        await axios.post(webhookURL, payload, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${accessToken}`
          }
        })

        return {}
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response) {
            switch (error.response.status) {
              case 401:
                args.logger.forBot().error('Unauthorized: Please check your API key and permissions.')
                throw new sdk.RuntimeError('Unauthorized: Please check your API key and permissions.')
              case 404:
                args.logger.forBot().error('Not Found: The specified resource was not found. Ensure the trigger node is listening for Post events')
                throw new sdk.RuntimeError('Not Found: The specified resource was not found. Ensure the trigger node is listening for Post events')
                default:
                args.logger.forBot().error(`Unexpected error: ${error.response.statusText}`)
                throw new sdk.RuntimeError(`Unexpected error: ${error.response.statusText}`)
            }
          } else if (error.request) {
            args.logger.forBot().error('No response received from n8n instance. Check the Webhook URL and ensure its valid.')
            throw new sdk.RuntimeError('No response received from n8n instance. Check the Webhook URL and ensure its valid.')
          } else {
            args.logger.forBot().error(`Error in request setup: ${error}`)
            throw new sdk.RuntimeError(`Error in request setup: ${error}`)
          }
        } else {
          args.logger.forBot().error(`Non-Axios error occurred: ${error}`)
          throw new sdk.RuntimeError(`Non-Axios error occurred: ${error}`)
        }
      }
    },
  },
  channels: {},
  handler: async ({req, logger, client}) => {
    const bodyObject = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const parsedData = n8nWebhookEventSchema.safeParse(bodyObject);
    
    logger.forBot().info('Received n8n webhook event:', parsedData)

    if (!parsedData.success) {
      logger.forBot().error('Invalid n8n webhook event. The Event must match the following format: { "conversation": { "id": "CONVERSATION_ID" }, "data": {} } ', parsedData.error)
      throw new sdk.RuntimeError('Invalid n8n webhook event. The Event must match the following format: { "conversation": { "id": "CONVERSATION_ID" }, "data": {} } ')
    }
    
    const conversationID = parsedData.data.conversation.id;
  
    if (conversationID) {
      try {
        const event = await client.createEvent({
          type: 'n8nEvent',
          payload: parsedData.data,
        })
        logger.forBot().info('n8n event created successfully.')
      } catch (error) {
        logger.forBot().error('Failed to create n8n event:', error)
        throw new sdk.RuntimeError(`Failed to create n8n event: ${error}`)
      }
    } else {
      logger.forBot().error('You must have a conversation ID in the payload to send an event to the bot.')
      throw new sdk.RuntimeError('You must have a conversation ID in the payload to send an event to the bot.')
    }

  }
})
