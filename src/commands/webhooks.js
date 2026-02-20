/**
 * Webhook Commands
 *
 * Manage webhooks via the Workflows API
 */

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { get, post, patch, del, formatOutput } from '../lib/api.js';
import { readFileSync } from 'fs';

export function registerWebhookCommands(program) {
  const webhooks = new Command('webhooks')
    .alias('webhook')
    .description('Manage webhooks');

  webhooks
    .command('list')
    .description('List all webhooks')
    .option('--format <format>', 'Output format (json, pretty)', 'pretty')
    .action(async (options) => {
      const spinner = ora('Fetching webhooks...').start();
      try {
        const data = await get('/workflows');
        spinner.succeed('Webhooks retrieved');
        console.log(formatOutput(data, options.format));
      } catch (error) {
        spinner.fail('Failed to fetch webhooks');
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });

  webhooks
    .command('create')
    .description('Create a webhook')
    .option('-f, --file <path>', 'JSON file with webhook data')
    .option('-d, --data <json>', 'JSON string with webhook data')
    .option('--format <format>', 'Output format (json, pretty)', 'pretty')
    .action(async (options) => {
      const spinner = ora('Creating webhook...').start();
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

        const result = await post('/workflows', data);
        spinner.succeed('Webhook created');
        console.log(formatOutput(result, options.format));
      } catch (error) {
        spinner.fail('Failed to create webhook');
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });

  webhooks
    .command('get <id>')
    .description('Get webhook details')
    .option('--format <format>', 'Output format (json, pretty)', 'pretty')
    .action(async (id, options) => {
      const spinner = ora(`Fetching webhook ${id}...`).start();
      try {
        const data = await get(`/workflows/${id}`);
        spinner.succeed('Webhook retrieved');
        console.log(formatOutput(data, options.format));
      } catch (error) {
        spinner.fail('Failed to fetch webhook');
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });

  webhooks
    .command('update <id>')
    .description('Update webhook')
    .option('-f, --file <path>', 'JSON file with update data')
    .option('-d, --data <json>', 'JSON string with update data')
    .option('--format <format>', 'Output format (json, pretty)', 'pretty')
    .action(async (id, options) => {
      const spinner = ora(`Updating webhook ${id}...`).start();
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

        const result = await patch(`/workflows/${id}`, data);
        spinner.succeed('Webhook updated');
        console.log(formatOutput(result, options.format));
      } catch (error) {
        spinner.fail('Failed to update webhook');
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });

  webhooks
    .command('delete <id>')
    .description('Delete webhook')
    .action(async (id) => {
      const spinner = ora(`Deleting webhook ${id}...`).start();
      try {
        await del(`/workflows/${id}`);
        spinner.succeed('Webhook deleted');
      } catch (error) {
        spinner.fail('Failed to delete webhook');
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });

  program.addCommand(webhooks);
}
