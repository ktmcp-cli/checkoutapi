![Banner](https://raw.githubusercontent.com/ktmcp-cli/checkoutapi/main/banner.svg)

> "Six months ago, everyone was talking about MCPs. And I was like, screw MCPs. Every MCP would be better as a CLI."
>
> — [Peter Steinberger](https://twitter.com/steipete), Founder of OpenClaw
> [Watch on YouTube (~2:39:00)](https://www.youtube.com/@lexfridman) | [Lex Fridman Podcast #491](https://lexfridman.com/peter-steinberger/)

# Checkout API CLI

Production-ready command-line interface for the [Checkout.com API](https://www.checkout.com/) - Payment processing and checkout automation.

> **⚠️ Unofficial CLI** - This tool is not officially sponsored, endorsed, or maintained by Checkout.com. It is an independent project built on the public Checkout.com API. API documentation: https://api-reference.checkout.com/

## Features

- Complete coverage of Checkout.com API endpoints
- Support for payments, refunds, captures, and voids
- Manage customers, payment instruments, and tokens
- Handle disputes and chargebacks
- Webhook management via Workflows API
- Event tracking and monitoring
- Balance queries
- Simple, intuitive command structure
- JSON and pretty-print output formats
- File-based and inline data input
- Comprehensive error handling
- Sandbox and production environment support
- Persistent configuration storage

## Why CLI > MCP

### The MCP Problem

Model Context Protocol (MCP) servers introduce unnecessary complexity and failure points for API access:

1. **Extra Infrastructure Layer**: MCP requires running a separate server process that sits between your AI agent and the API
2. **Cognitive Overhead**: Agents must learn MCP-specific tool schemas on top of the actual API semantics
3. **Debugging Nightmare**: When things fail, you're debugging three layers (AI → MCP → API) instead of two (AI → API)
4. **Limited Flexibility**: MCP servers often implement a subset of API features, forcing you to extend or work around limitations
5. **Maintenance Burden**: Every API change requires updating both the MCP server and documentation

### The CLI Advantage

A well-designed CLI is the superior abstraction for AI agents:

1. **Zero Runtime Dependencies**: No server process to start, monitor, or crash
2. **Direct API Access**: One hop from agent to API with transparent HTTP calls
3. **Human + AI Usable**: Same tool works perfectly for both developers and agents
4. **Self-Documenting**: Built-in `--help` text provides complete usage information
5. **Composable**: Standard I/O allows piping, scripting, and integration with other tools
6. **Better Errors**: Direct error messages from the API without translation layers
7. **Instant Debugging**: `--format json` gives you the exact API response for inspection

**Example Complexity Comparison:**

MCP approach:
```
AI Agent → MCP Tool Schema → MCP Server → HTTP Request → API → Response Chain (reverse)
```

CLI approach:
```
AI Agent → Shell Command → HTTP Request → API → Direct Response
```

The CLI is simpler, faster, more reliable, and easier to debug.

## Installation

```bash
npm install -g @ktmcp-cli/checkoutapi
```

Or install locally:

```bash
cd checkoutapi
npm install
npm link
```

## Configuration

### Set API Keys

Get your API keys from https://dashboard.checkout.com/

```bash
# Set secret key (required for server-side operations)
checkoutapi config set secretKey sk_sbox_your_secret_key

# Set public key (optional, for client-side operations)
checkoutapi config set publicKey pk_sbox_your_public_key

# Set client ID (for custom API endpoints)
checkoutapi config set clientId cli_your_client_id

# Set environment (sandbox or production)
checkoutapi config set environment sandbox
```

### Environment Variables

Alternatively, use environment variables:

```bash
export CHECKOUT_SECRET_KEY=sk_sbox_your_secret_key
export CHECKOUT_PUBLIC_KEY=pk_sbox_your_public_key
export CHECKOUT_CLIENT_ID=cli_your_client_id
export CHECKOUT_ENVIRONMENT=sandbox  # or production
```

### View Configuration

```bash
# Show all config
checkoutapi config list

# Get specific value
checkoutapi config get secretKey

# Clear all config
checkoutapi config clear
```

## Usage

### General Syntax

```bash
checkoutapi <resource> <action> [options]
```

### Available Resources

- `payments` (alias: `payment`) - Process and manage payments
- `tokens` (alias: `token`) - Create payment tokens
- `instruments` (alias: `instrument`) - Manage payment instruments
- `customers` (alias: `customer`) - Manage customers
- `disputes` (alias: `dispute`) - Handle disputes and chargebacks
- `webhooks` (alias: `webhook`) - Manage webhooks
- `sources` (alias: `source`) - Manage payment sources
- `events` (alias: `event`) - Track events
- `balances` (alias: `balance`) - Query balances

### Global Options

- `-f, --format <format>` - Output format: `json` or `pretty` (default: pretty)
- `-h, --help` - Display help for command
- `-v, --version` - Output version number

## Examples

### Payments

```bash
# Create a payment
checkoutapi payments create --file payment.json

# Get payment details
checkoutapi payments get pay_xxx

# List payments
checkoutapi payments list --limit 10 --skip 0

# Filter by reference
checkoutapi payments list --reference "ORDER-123"

# Capture a payment
checkoutapi payments capture pay_xxx --amount 1000

# Void a payment
checkoutapi payments void pay_xxx

# Refund a payment
checkoutapi payments refund pay_xxx --amount 500

# Get payment actions
checkoutapi payments actions pay_xxx
```

### Tokens

```bash
# Create a payment token (uses public key)
checkoutapi tokens create --file token.json

# Create token with inline data
checkoutapi tokens create --data '{
  "type": "card",
  "number": "4242424242424242",
  "expiry_month": 12,
  "expiry_year": 2025,
  "cvv": "123"
}'
```

### Customers

```bash
# Create a customer
checkoutapi customers create --file customer.json

# Get customer
checkoutapi customers get cus_xxx

# Update customer
checkoutapi customers update cus_xxx --data '{"name":"Updated Name"}'

# Delete customer
checkoutapi customers delete cus_xxx
```

### Payment Instruments

```bash
# Create payment instrument
checkoutapi instruments create --file instrument.json

# Get instrument
checkoutapi instruments get src_xxx

# Update instrument
checkoutapi instruments update src_xxx --file updated-instrument.json

# Delete instrument
checkoutapi instruments delete src_xxx
```

### Disputes

```bash
# List all disputes
checkoutapi disputes list --limit 20

# Filter by status
checkoutapi disputes list --status evidence_required

# Get dispute details
checkoutapi disputes get dsp_xxx

# Accept a dispute
checkoutapi disputes accept dsp_xxx

# Provide evidence
checkoutapi disputes provide-evidence dsp_xxx --file evidence.json
```

### Webhooks

```bash
# List all webhooks
checkoutapi webhooks list

# Create webhook
checkoutapi webhooks create --file webhook.json

# Get webhook
checkoutapi webhooks get wf_xxx

# Update webhook
checkoutapi webhooks update wf_xxx --file updated-webhook.json

# Delete webhook
checkoutapi webhooks delete wf_xxx
```

### Events

```bash
# List all events
checkoutapi events list --limit 10

# Filter by payment ID
checkoutapi events list --payment-id pay_xxx

# Get event details
checkoutapi events get evt_xxx

# List event types
checkoutapi events types
```

### Balances

```bash
# Get account balances
checkoutapi balances get

# JSON output
checkoutapi balances get --format json
```

## Data Formats

### Creating a Payment

Example `payment.json`:

```json
{
  "source": {
    "type": "token",
    "token": "tok_xxx"
  },
  "amount": 1000,
  "currency": "USD",
  "reference": "ORDER-123",
  "customer": {
    "email": "customer@example.com",
    "name": "John Doe"
  },
  "description": "Order #123"
}
```

### Creating a Token

Example `token.json`:

```json
{
  "type": "card",
  "number": "4242424242424242",
  "expiry_month": 12,
  "expiry_year": 2025,
  "cvv": "123",
  "name": "John Doe",
  "billing_address": {
    "address_line1": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zip": "10001",
    "country": "US"
  }
}
```

### Creating a Customer

Example `customer.json`:

```json
{
  "email": "customer@example.com",
  "name": "John Doe",
  "phone": {
    "country_code": "+1",
    "number": "5551234567"
  }
}
```

### Creating a Webhook

Example `webhook.json`:

```json
{
  "name": "Payment Status Updates",
  "enabled": true,
  "conditions": [
    {
      "type": "event",
      "events": {
        "gateway": [
          "payment_approved",
          "payment_declined",
          "payment_captured"
        ]
      }
    }
  ],
  "actions": [
    {
      "type": "webhook",
      "url": "https://example.com/webhooks/checkout",
      "headers": {
        "Authorization": "Bearer your-token"
      }
    }
  ]
}
```

## Error Handling

The CLI provides clear error messages for common issues:

- **401 Unauthorized** - Check your API key
- **403 Forbidden** - Insufficient permissions
- **404 Not Found** - Resource doesn't exist
- **422 Validation Error** - Invalid data format
- **429 Rate Limit** - Too many requests
- **500 Server Error** - Checkout.com API issue

## Environments

### Sandbox

Use sandbox environment for testing:

```bash
checkoutapi config set environment sandbox
checkoutapi config set secretKey sk_sbox_your_sandbox_key
```

API Base URL: `https://{prefix}.api.sandbox.checkout.com`

### Production

Switch to production for live transactions:

```bash
checkoutapi config set environment production
checkoutapi config set secretKey sk_your_production_key
```

API Base URL: `https://{prefix}.api.checkout.com`

The `{prefix}` is automatically extracted from your client ID (first 8 characters without `cli_` prefix).

## Development

```bash
# Install dependencies
npm install

# Run locally
npm run dev -- payments list

# Run directly
node bin/checkoutapi.js payments list
```

## Support This Project

If you find this CLI useful, we'd appreciate support across Reddit, Twitter, Hacker News, or Moltbook. Please be mindful - these are real community accounts. Contributors who can demonstrate their support helped advance KTMCP will have their PRs and feature requests prioritized.

## API Documentation

- Official API Reference: https://api-reference.checkout.com/
- Developer Docs: https://www.checkout.com/docs
- Dashboard: https://dashboard.checkout.com/
- Support: https://www.checkout.com/support

## Supported Payment Methods

The API supports multiple payment methods including:
- Credit/Debit Cards (Visa, Mastercard, Amex, etc.)
- Digital Wallets (Apple Pay, Google Pay)
- Alternative Payment Methods (PayPal, Klarna, etc.)
- Bank Transfers
- Local Payment Methods

## License

MIT

## Support

For issues and feature requests, please contact support or refer to the official Checkout.com documentation.


---

## Support KTMCP

If you find this CLI useful, we'd greatly appreciate your support! Share your experience on:
- Reddit
- Twitter/X
- Hacker News

**Incentive:** Users who can demonstrate that their support/advocacy helped advance KTMCP will have their feature requests and issues prioritized.

Just be mindful - these are real accounts and real communities. Authentic mentions and genuine recommendations go a long way!

