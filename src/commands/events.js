/**
 * Event Commands
 *
 * Manage and retrieve events
 */

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { get, formatOutput } from '../lib/api.js';

export function registerEventCommands(program) {
  const events = new Command('events')
    .alias('event')
    .description('Manage events');

  events
    .command('list')
    .description('List all events')
    .option('--limit <number>', 'Number of results', '10')
    .option('--skip <number>', 'Number to skip', '0')
    .option('--payment-id <id>', 'Filter by payment ID')
    .option('--format <format>', 'Output format (json, pretty)', 'pretty')
    .action(async (options) => {
      const spinner = ora('Fetching events...').start();
      try {
        const params = {
          limit: options.limit,
          skip: options.skip,
        };

        if (options.paymentId) params.payment_id = options.paymentId;

        const data = await get('/events', params);
        spinner.succeed('Events retrieved');
        console.log(formatOutput(data, options.format));
      } catch (error) {
        spinner.fail('Failed to fetch events');
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });

  events
    .command('get <id>')
    .description('Get event details')
    .option('--format <format>', 'Output format (json, pretty)', 'pretty')
    .action(async (id, options) => {
      const spinner = ora(`Fetching event ${id}...`).start();
      try {
        const data = await get(`/events/${id}`);
        spinner.succeed('Event retrieved');
        console.log(formatOutput(data, options.format));
      } catch (error) {
        spinner.fail('Failed to fetch event');
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });

  events
    .command('types')
    .description('List all event types')
    .option('--format <format>', 'Output format (json, pretty)', 'pretty')
    .action(async (options) => {
      const spinner = ora('Fetching event types...').start();
      try {
        const data = await get('/event-types');
        spinner.succeed('Event types retrieved');
        console.log(formatOutput(data, options.format));
      } catch (error) {
        spinner.fail('Failed to fetch event types');
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });

  program.addCommand(events);
}
