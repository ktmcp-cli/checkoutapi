/**
 * Token Commands
 *
 * Manage payment tokens for securely storing card details
 */

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { post, formatOutput } from '../lib/api.js';
import { readFileSync } from 'fs';

export function registerTokenCommands(program) {
  const tokens = new Command('tokens')
    .alias('token')
    .description('Manage payment tokens');

  tokens
    .command('create')
    .description('Create a payment token')
    .option('-f, --file <path>', 'JSON file with token data')
    .option('-d, --data <json>', 'JSON string with token data')
    .option('--format <format>', 'Output format (json, pretty)', 'pretty')
    .action(async (options) => {
      const spinner = ora('Creating token...').start();
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

        const result = await post('/tokens', data, true); // Use public key
        spinner.succeed('Token created');
        console.log(formatOutput(result, options.format));
      } catch (error) {
        spinner.fail('Failed to create token');
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });

  program.addCommand(tokens);
}
