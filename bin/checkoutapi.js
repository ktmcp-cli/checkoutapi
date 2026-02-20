#!/usr/bin/env node

/**
 * Checkout API CLI - Main Entry Point
 *
 * Production-ready CLI for Checkout.com API
 * Payment processing and checkout automation
 */

import { Command } from 'commander';
import { showWelcomeMessage } from '../src/lib/welcome.js';

showWelcomeMessage('checkoutapi');
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import chalk from 'chalk';

// Import command modules
import { registerConfigCommands } from '../src/commands/config.js';
import { registerPaymentCommands } from '../src/commands/payments.js';
import { registerTokenCommands } from '../src/commands/tokens.js';
import { registerInstrumentCommands } from '../src/commands/instruments.js';
import { registerCustomerCommands } from '../src/commands/customers.js';
import { registerDisputeCommands } from '../src/commands/disputes.js';
import { registerWebhookCommands } from '../src/commands/webhooks.js';
import { registerSourceCommands } from '../src/commands/sources.js';
import { registerEventCommands } from '../src/commands/events.js';
import { registerBalanceCommands } from '../src/commands/balances.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load package.json
const packageJson = JSON.parse(
  readFileSync(join(__dirname, '../package.json'), 'utf-8')
);

const program = new Command();

// Configure main program
program
  .name('checkoutapi')
  .description(chalk.cyan('Checkout.com API CLI - Payment processing and checkout automation'))
  .version(packageJson.version, '-v, --version', 'output the current version')
  .addHelpText('after', `
${chalk.bold('Examples:')}
  $ checkoutapi config set secretKey <your-secret-key>
  $ checkoutapi config set clientId <your-client-id>
  $ checkoutapi payments list --limit 10
  $ checkoutapi payments create -f payment.json
  $ checkoutapi payments get pay_xxx
  $ checkoutapi customers list
  $ checkoutapi disputes list

${chalk.bold('API Documentation:')}
  ${chalk.blue('https://api-reference.checkout.com/')}

${chalk.bold('Get API Keys:')}
  ${chalk.blue('https://dashboard.checkout.com/')}
`);

// Register all command modules
registerConfigCommands(program);
registerPaymentCommands(program);
registerTokenCommands(program);
registerInstrumentCommands(program);
registerCustomerCommands(program);
registerDisputeCommands(program);
registerWebhookCommands(program);
registerSourceCommands(program);
registerEventCommands(program);
registerBalanceCommands(program);

// Global error handler
process.on('unhandledRejection', (error) => {
  console.error(chalk.red('Unhandled error:'), error);
  process.exit(1);
});

// Parse command line arguments
program.parse(process.argv);
