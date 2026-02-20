/**
 * Configuration Commands
 *
 * Manage CLI configuration and API keys
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { getConfig, setConfig, getAllConfig, deleteConfig, clearConfig } from '../lib/config.js';

export function registerConfigCommands(program) {
  const config = new Command('config')
    .description('Manage configuration');

  config
    .command('set <key> <value>')
    .description('Set configuration value')
    .action((key, value) => {
      try {
        setConfig(key, value);
        console.log(chalk.green(`✓ Set ${key}`));
      } catch (error) {
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });

  config
    .command('get <key>')
    .description('Get configuration value')
    .action((key) => {
      try {
        const value = getConfig(key);
        if (value === undefined) {
          console.log(chalk.yellow(`${key} is not set`));
        } else {
          console.log(value);
        }
      } catch (error) {
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });

  config
    .command('list')
    .description('List all configuration')
    .action(() => {
      try {
        const allConfig = getAllConfig();
        console.log(chalk.cyan('Current configuration:'));
        console.log(JSON.stringify(allConfig, null, 2));
      } catch (error) {
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });

  config
    .command('delete <key>')
    .description('Delete configuration value')
    .action((key) => {
      try {
        deleteConfig(key);
        console.log(chalk.green(`✓ Deleted ${key}`));
      } catch (error) {
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });

  config
    .command('clear')
    .description('Clear all configuration')
    .action(() => {
      try {
        clearConfig();
        console.log(chalk.green('✓ Configuration cleared'));
      } catch (error) {
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });

  program.addCommand(config);
}
