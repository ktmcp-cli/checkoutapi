/**
 * Payment Commands
 *
 * Manage payment processing
 */

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { get, post, patch, formatOutput } from '../lib/api.js';
import { readFileSync } from 'fs';

export function registerPaymentCommands(program) {
  const payments = new Command('payments')
    .alias('payment')
    .description('Manage payments');

  payments
    .command('create')
    .description('Request a payment')
    .option('-f, --file <path>', 'JSON file with payment data')
    .option('-d, --data <json>', 'JSON string with payment data')
    .option('--format <format>', 'Output format (json, pretty)', 'pretty')
    .action(async (options) => {
      const spinner = ora('Creating payment...').start();
      try {
        let data;
        if (options.file) {
          data = JSON.parse(readFileSync(options.file, 'utf-8'));
        } else if (options.data) {
          data = JSON.parse(options.data);
        } else {
          spinner.fail('No data provided');
          console.error(chalk.red('Error: Provide data with --file or --data'));
          process.exit(1);
        }

        const result = await post('/payments', data);
        spinner.succeed('Payment created');
        console.log(formatOutput(result, options.format));
      } catch (error) {
        spinner.fail('Failed to create payment');
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });

  payments
    .command('get <id>')
    .description('Get payment details')
    .option('--format <format>', 'Output format (json, pretty)', 'pretty')
    .action(async (id, options) => {
      const spinner = ora(`Fetching payment ${id}...`).start();
      try {
        const data = await get(`/payments/${id}`);
        spinner.succeed('Payment retrieved');
        console.log(formatOutput(data, options.format));
      } catch (error) {
        spinner.fail('Failed to fetch payment');
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });

  payments
    .command('list')
    .description('List payments')
    .option('--limit <number>', 'Number of results', '10')
    .option('--skip <number>', 'Number to skip', '0')
    .option('--reference <ref>', 'Filter by reference')
    .option('--format <format>', 'Output format (json, pretty)', 'pretty')
    .action(async (options) => {
      const spinner = ora('Fetching payments...').start();
      try {
        const params = {
          limit: options.limit,
          skip: options.skip,
        };

        if (options.reference) params.reference = options.reference;

        const data = await get('/payments', params);
        spinner.succeed('Payments retrieved');
        console.log(formatOutput(data, options.format));
      } catch (error) {
        spinner.fail('Failed to fetch payments');
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });

  payments
    .command('capture <id>')
    .description('Capture a payment')
    .option('-f, --file <path>', 'JSON file with capture data')
    .option('-d, --data <json>', 'JSON string with capture data')
    .option('--amount <amount>', 'Amount to capture')
    .option('--format <format>', 'Output format (json, pretty)', 'pretty')
    .action(async (id, options) => {
      const spinner = ora(`Capturing payment ${id}...`).start();
      try {
        let data = {};
        if (options.file) {
          data = JSON.parse(readFileSync(options.file, 'utf-8'));
        } else if (options.data) {
          data = JSON.parse(options.data);
        } else if (options.amount) {
          data = { amount: parseInt(options.amount) };
        }

        const result = await post(`/payments/${id}/captures`, data);
        spinner.succeed('Payment captured');
        console.log(formatOutput(result, options.format));
      } catch (error) {
        spinner.fail('Failed to capture payment');
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });

  payments
    .command('void <id>')
    .description('Void a payment')
    .option('-f, --file <path>', 'JSON file with void data')
    .option('-d, --data <json>', 'JSON string with void data')
    .option('--format <format>', 'Output format (json, pretty)', 'pretty')
    .action(async (id, options) => {
      const spinner = ora(`Voiding payment ${id}...`).start();
      try {
        let data = {};
        if (options.file) {
          data = JSON.parse(readFileSync(options.file, 'utf-8'));
        } else if (options.data) {
          data = JSON.parse(options.data);
        }

        const result = await post(`/payments/${id}/voids`, data);
        spinner.succeed('Payment voided');
        console.log(formatOutput(result, options.format));
      } catch (error) {
        spinner.fail('Failed to void payment');
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });

  payments
    .command('refund <id>')
    .description('Refund a payment')
    .option('-f, --file <path>', 'JSON file with refund data')
    .option('-d, --data <json>', 'JSON string with refund data')
    .option('--amount <amount>', 'Amount to refund')
    .option('--format <format>', 'Output format (json, pretty)', 'pretty')
    .action(async (id, options) => {
      const spinner = ora(`Refunding payment ${id}...`).start();
      try {
        let data = {};
        if (options.file) {
          data = JSON.parse(readFileSync(options.file, 'utf-8'));
        } else if (options.data) {
          data = JSON.parse(options.data);
        } else if (options.amount) {
          data = { amount: parseInt(options.amount) };
        }

        const result = await post(`/payments/${id}/refunds`, data);
        spinner.succeed('Payment refunded');
        console.log(formatOutput(result, options.format));
      } catch (error) {
        spinner.fail('Failed to refund payment');
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });

  payments
    .command('actions <id>')
    .description('Get payment actions')
    .option('--format <format>', 'Output format (json, pretty)', 'pretty')
    .action(async (id, options) => {
      const spinner = ora(`Fetching payment actions for ${id}...`).start();
      try {
        const data = await get(`/payments/${id}/actions`);
        spinner.succeed('Payment actions retrieved');
        console.log(formatOutput(data, options.format));
      } catch (error) {
        spinner.fail('Failed to fetch payment actions');
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });

  program.addCommand(payments);
}
