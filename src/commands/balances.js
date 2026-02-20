/**
 * Balance Commands
 *
 * Query account balances
 */

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { get, formatOutput } from '../lib/api.js';

export function registerBalanceCommands(program) {
  const balances = new Command('balances')
    .alias('balance')
    .description('Query balances');

  balances
    .command('get')
    .description('Get account balances')
    .option('--format <format>', 'Output format (json, pretty)', 'pretty')
    .action(async (options) => {
      const spinner = ora('Fetching balances...').start();
      try {
        const data = await get('/balances');
        spinner.succeed('Balances retrieved');
        console.log(formatOutput(data, options.format));
      } catch (error) {
        spinner.fail('Failed to fetch balances');
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });

  program.addCommand(balances);
}
