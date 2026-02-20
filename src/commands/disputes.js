/**
 * Dispute Commands
 *
 * Manage payment disputes and chargebacks
 */

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { get, post, put, formatOutput } from '../lib/api.js';
import { readFileSync, writeFileSync } from 'fs';

export function registerDisputeCommands(program) {
  const disputes = new Command('disputes')
    .alias('dispute')
    .description('Manage disputes');

  disputes
    .command('list')
    .description('List all disputes')
    .option('--limit <number>', 'Number of results', '10')
    .option('--skip <number>', 'Number to skip', '0')
    .option('--status <status>', 'Filter by status')
    .option('--format <format>', 'Output format (json, pretty)', 'pretty')
    .action(async (options) => {
      const spinner = ora('Fetching disputes...').start();
      try {
        const params = {
          limit: options.limit,
          skip: options.skip,
        };

        if (options.status) params.status = options.status;

        const data = await get('/disputes', params);
        spinner.succeed('Disputes retrieved');
        console.log(formatOutput(data, options.format));
      } catch (error) {
        spinner.fail('Failed to fetch disputes');
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });

  disputes
    .command('get <id>')
    .description('Get dispute details')
    .option('--format <format>', 'Output format (json, pretty)', 'pretty')
    .action(async (id, options) => {
      const spinner = ora(`Fetching dispute ${id}...`).start();
      try {
        const data = await get(`/disputes/${id}`);
        spinner.succeed('Dispute retrieved');
        console.log(formatOutput(data, options.format));
      } catch (error) {
        spinner.fail('Failed to fetch dispute');
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });

  disputes
    .command('accept <id>')
    .description('Accept a dispute')
    .option('--format <format>', 'Output format (json, pretty)', 'pretty')
    .action(async (id, options) => {
      const spinner = ora(`Accepting dispute ${id}...`).start();
      try {
        const result = await post(`/disputes/${id}/accept`);
        spinner.succeed('Dispute accepted');
        console.log(formatOutput(result, options.format));
      } catch (error) {
        spinner.fail('Failed to accept dispute');
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });

  disputes
    .command('provide-evidence <id>')
    .description('Provide evidence for a dispute')
    .option('-f, --file <path>', 'JSON file with evidence data')
    .option('-d, --data <json>', 'JSON string with evidence data')
    .option('--format <format>', 'Output format (json, pretty)', 'pretty')
    .action(async (id, options) => {
      const spinner = ora(`Providing evidence for dispute ${id}...`).start();
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

        const result = await put(`/disputes/${id}/evidence`, data);
        spinner.succeed('Evidence provided');
        console.log(formatOutput(result, options.format));
      } catch (error) {
        spinner.fail('Failed to provide evidence');
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });

  program.addCommand(disputes);
}
