import { serve } from 'inngest/next'
import { inngest } from '../../../../inngest/client'
import {
  handleCheckoutCompleted,
  handleSubscriptionUpdated,
  handleInvoicePaid,
  handleInvoicePaymentFailed,
} from '../../../../inngest/functions/stripe'
import {
  syncAllSubscriptions,
  checkExpiredMemberships,
} from '../../../../inngest/functions/membership'

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    handleCheckoutCompleted,
    handleSubscriptionUpdated,
    handleInvoicePaid,
    handleInvoicePaymentFailed,
    syncAllSubscriptions,
    checkExpiredMemberships,
  ],
})
