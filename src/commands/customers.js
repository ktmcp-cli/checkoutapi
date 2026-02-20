/**
 * Customer Commands
 *
 * Manage customers
 */

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { get, post, patch, del, formatOutput } from '../lib/api.js';
import { readFileSync } from 'fs';

export function registerCustomerCommands(program) {
  const customers = new Command('customers')
    .alias('customer')
    .description('Manage customers');

  customers
    .command('create')
    .description('Create a customer')
    .option('-f, --file <path>', 'JSON file with customer data')
    .option('-d, --data <json>', 'JSON string with customer data')
    .option('--format <format>', 'Output format (json, pretty)', 'pretty')
    .action(async (options) => {
      const spinner = ora('Creating customer...').start();
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

        const result = await post('/customers', data);
        spinner.succeed('Customer created');
        console.log(formatOutput(result, options.format));
      } catch (error) {
        spinner.fail('Failed to create customer');
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });

  customers
    .command('get <id>')
    .description('Get customer details')
    .option('--format <format>', 'Output format (json, pretty)', 'pretty')
    .action(async (id, options) => {
      const spinner = ora(`Fetching customer ${id}...`).start();
      try {
        const data = await get(`/customers/${id}`);
        spinner.succeed('Customer retrieved');
        console.log(formatOutput(data, options.format));
      } catch (error) {
        spinner.fail('Failed to fetch customer');
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });

  customers
    .command('update <id>')
    .description('Update customer')
    .option('-f, --file <path>', 'JSON file with update data')
    .option('-d, --data <json>', 'JSON string with update data')
    .option('--format <format>', 'Output format (json, pretty)', 'pretty')
    .action(async (id, options) => {
      const spinner = ora(`Updating customer ${id}...`).start();
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

        const result = await patch(`/customers/${id}`, data);
        spinner.succeed('Customer updated');
        console.log(formatOutput(result, options.format));
      } catch (error) {
        spinner.fail('Failed to update customer');
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });

  customers
    .command('delete <id>')
    .description('Delete customer')
    .action(async (id) => {
      const spinner = ora(`Deleting customer ${id}...`).start();
      try {
        await del(`/customers/${id}`);
        spinner.succeed('Customer deleted');
      } catch (error) {
        spinner.fail('Failed to delete customer');
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });

  program.addCommand(customers);
}
