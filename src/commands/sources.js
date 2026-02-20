/**
 * Source Commands
 *
 * Manage payment sources
 */

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { get, post, formatOutput } from '../lib/api.js';
import { readFileSync } from 'fs';

export function registerSourceCommands(program) {
  const sources = new Command('sources')
    .alias('source')
    .description('Manage payment sources');

  sources
    .command('create')
    .description('Create a payment source')
    .option('-f, --file <path>', 'JSON file with source data')
    .option('-d, --data <json>', 'JSON string with source data')
    .option('--format <format>', 'Output format (json, pretty)', 'pretty')
    .action(async (options) => {
      const spinner = ora('Creating source...').start();
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

        const result = await post('/sources', data);
        spinner.succeed('Source created');
        console.log(formatOutput(result, options.format));
      } catch (error) {
        spinner.fail('Failed to create source');
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });

  program.addCommand(sources);
}
