# Checkout API CLI - AI Agent Usage Guide

This guide is designed for AI agents (like Claude, GPT-4, etc.) to effectively use the Checkout API CLI.

## Quick Start for Agents

### 1. Configuration Check

Before making any API calls, verify the API keys are configured:

```bash
checkoutapi config get secretKey
checkoutapi config get clientId
checkoutapi config get environment
```

If not set, configure them:

```bash
checkoutapi config set secretKey sk_sbox_your_key
checkoutapi config set clientId cli_your_client_id
checkoutapi config set environment sandbox
```

### 2. Common Workflows

#### Process a Payment

```bash
# Step 1: Create a payment token (if needed)
checkoutapi tokens create --data '{
  "type": "card",
  "number": "4242424242424242",
  "expiry_month": 12,
  "expiry_year": 2025,
  "cvv": "123"
}'

# Step 2: Create payment with token
checkoutapi payments create --data '{
  "source": {
    "type": "token",
    "token": "tok_xxx"
  },
  "amount": 1000,
  "currency": "USD",
  "reference": "ORDER-123"
}'

# Step 3: Capture the payment (if authorized)
checkoutapi payments capture pay_xxx --amount 1000
```

#### Handle Refunds

```bash
# Full refund
checkoutapi payments refund pay_xxx

# Partial refund
checkoutapi payments refund pay_xxx --amount 500

# Check refund status
checkoutapi payments get pay_xxx
```

#### Manage Disputes

```bash
# List pending disputes
checkoutapi disputes list --status evidence_required --format json

# Get dispute details
checkoutapi disputes get dsp_xxx

# Provide evidence
checkoutapi disputes provide-evidence dsp_xxx --file evidence.json

# Accept dispute if no evidence
checkoutapi disputes accept dsp_xxx
```

#### Set Up Webhooks

```bash
# Create webhook for payment events
checkoutapi webhooks create --data '{
  "name": "Payment Updates",
  "enabled": true,
  "conditions": [{
    "type": "event",
    "events": {
      "gateway": ["payment_approved", "payment_captured", "payment_declined"]
    }
  }],
  "actions": [{
    "type": "webhook",
    "url": "https://example.com/webhooks/checkout"
  }]
}'

# List all webhooks
checkoutapi webhooks list
```

## Output Parsing

### JSON Format (Recommended for Agents)

Always use `--format json` when you need to parse the output programmatically:

```bash
checkoutapi payments list --format json
```

This returns structured JSON that's easy to parse:

```json
{
  "limit": 10,
  "skip": 0,
  "total_count": 42,
  "data": [
    {
      "id": "pay_xxx",
      "amount": 1000,
      "currency": "USD",
      "status": "Authorized",
      "approved": true,
      "reference": "ORDER-123"
    }
  ]
}
```

### Pretty Format (Human-Readable)

The default `pretty` format is good for displaying to users but harder to parse:

```bash
checkoutapi payments get pay_xxx
```

## API Response Patterns

### Payment States

Payments can be in these states:
- **Pending**: Payment is being processed
- **Authorized**: Payment authorized but not captured
- **Captured**: Payment captured (funds will be transferred)
- **Declined**: Payment declined
- **Voided**: Authorization voided
- **Refunded**: Payment refunded (partially or fully)

### Common Response Fields

Most resources return these common fields:
- `id`: Unique identifier
- `_links`: HATEOAS links to related resources
- `created_on`: ISO 8601 timestamp
- `reference`: Your custom reference

## Error Handling

### Authentication Errors

```
Error: Authentication failed. Check your API key.
```

**Solution**: Verify your secret key is correct and matches the environment (sandbox/production).

### Validation Errors

```
Error: Validation error: {"error_codes":["amount_invalid"]}
```

**Solution**: Check the data format matches the API specification. Amount should be in minor units (cents).

### Rate Limiting

Checkout.com API has rate limits. If you hit them:

```
Error: Rate limit exceeded. Retry after 60 seconds.
```

**Solution**: Implement exponential backoff or wait the specified time.

## Advanced Usage

### Processing Multiple Payments

When processing multiple payments, use JSON format and handle errors gracefully:

```bash
for order_id in order_123 order_124 order_125; do
  result=$(checkoutapi payments create \
    --file "payments/${order_id}.json" \
    --format json 2>&1)

  if echo "$result" | grep -q "payment_id"; then
    echo "Success: $order_id"
  else
    echo "Failed: $order_id - $result"
  fi
done
```

### Monitoring Events

Set up a workflow to poll for new events:

```bash
# Get latest events
checkoutapi events list \
  --limit 50 \
  --format json > latest_events.json

# Process events
# Your event processing logic here
```

### Balance Reconciliation

Check balances regularly:

```bash
checkoutapi balances get --format json
```

## Best Practices for Agents

1. **Always use --format json** for parsing responses
2. **Store payment IDs** from responses for future reference
3. **Handle errors gracefully** with proper error messages
4. **Use references** to link payments to your system's orders
5. **Validate amounts** before creating payments (use minor units)
6. **Test in sandbox** before using production
7. **Set up webhooks** instead of polling for status updates
8. **Log all transactions** for audit trails

## Common Data Transformations

### Amount Conversion

Checkout.com uses minor currency units (cents):

```javascript
// Convert dollars to cents
const dollars = 10.50;
const cents = Math.round(dollars * 100); // 1050

// Use in CLI
checkoutapi payments create --data "{\"amount\": ${cents}, ...}"
```

### Date Filtering

When filtering by dates, use ISO 8601 format:

```bash
# Events from last 24 hours
checkoutapi events list \
  --from "$(date -u -d '24 hours ago' +%Y-%m-%dT%H:%M:%SZ)" \
  --format json
```

## Testing

### Test Card Numbers

Use these test cards in sandbox:

- **Approved**: 4242 4242 4242 4242
- **Declined**: 4000 0000 0000 0002
- **Insufficient funds**: 4000 0000 0000 9995
- **3D Secure required**: 4000 0000 0000 3220

### Test Flow

```bash
# 1. Set to sandbox
checkoutapi config set environment sandbox

# 2. Create test payment
checkoutapi payments create --data '{
  "source": {
    "type": "card",
    "number": "4242424242424242",
    "expiry_month": 12,
    "expiry_year": 2025,
    "cvv": "123"
  },
  "amount": 1000,
  "currency": "USD"
}'

# 3. Verify payment
checkoutapi payments get pay_xxx --format json
```

## API Limits

- **Rate limit**: Varies by endpoint (typically 1000 requests/minute)
- **Request size**: Max 1MB
- **Response size**: Paginated for large datasets

## Resources

- API Reference: https://api-reference.checkout.com/
- Sandbox Dashboard: https://dashboard.sandbox.checkout.com/
- Production Dashboard: https://dashboard.checkout.com/

## Support

For agent-specific questions or issues, refer to:
1. This AGENT.md file
2. The main README.md
3. Official API documentation
4. Built-in help: `checkoutapi <command> --help`
