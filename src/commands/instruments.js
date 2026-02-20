/**
 * Instrument Commands
 *
 * Manage payment instruments (stored payment methods)
 */

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { get, post, patch, del, formatOutput } from '../lib/api.js';
import { readFileSync } from 'fs';

export function registerInstrumentCommands(program) {
  const instruments = new Command('instruments')
    .alias('instrument')
    .description('Manage payment instruments');

  instruments
    .command('create')
    .description('Create a payment instrument')
    .option('-f, --file <path>', 'JSON file with instrument data')
    .option('-d, --data <json>', 'JSON string with instrument data')
    .option('--format <format>', 'Output format (json, pretty)', 'pretty')
    .action(async (options) => {
      const spinner = ora('Creating instrument...').start();
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

        const result = await post('/instruments', data);
        spinner.succeed('Instrument created');
        console.log(formatOutput(result, options.format));
      } catch (error) {
        spinner.fail('Failed to create instrument');
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });

  instruments
    .command('get <id>')
    .description('Get instrument details')
    .option('--format <format>', 'Output format (json, pretty)', 'pretty')
    .action(async (id, options) => {
      const spinner = ora(`Fetching instrument ${id}...`).start();
      try {
        const data = await get(`/instruments/${id}`);
        spinner.succeed('Instrument retrieved');
        console.log(formatOutput(data, options.format));
      } catch (error) {
        spinner.fail('Failed to fetch instrument');
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });

  instruments
    .command('update <id>')
    .description('Update instrument')
    .option('-f, --file <path>', 'JSON file with update data')
    .option('-d, --data <json>', 'JSON string with update data')
    .option('--format <format>', 'Output format (json, pretty)', 'pretty')
    .action(async (id, options) => {
      const spinner = ora(`Updating instrument ${id}...`).start();
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

        const result = await patch(`/instruments/${id}`, data);
        spinner.succeed('Instrument updated');
        console.log(formatOutput(result, options.format));
      } catch (error) {
        spinner.fail('Failed to update instrument');
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });

  instruments
    .command('delete <id>')
    .description('Delete instrument')
    .action(async (id) => {
      const spinner = ora(`Deleting instrument ${id}...`).start();
      try {
        await del(`/instruments/${id}`);
        spinner.succeed('Instrument deleted');
      } catch (error) {
        spinner.fail('Failed to delete instrument');
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });

  program.addCommand(instruments);
}
