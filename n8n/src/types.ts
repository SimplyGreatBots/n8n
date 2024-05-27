import { z } from '@botpress/sdk'

export const n8nWebhookEventSchema = z.object({
    conversation: z.object({
      id: z.string().describe('ID of the conversation'),
    }),
    data: z.record(z.any()),
  }).passthrough();