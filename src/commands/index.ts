import { AddKeyCommand } from './add_key_command.js'
import { CheckConfigCommand } from './check_config_command.js'
import { RunActionCommand } from './run_action_command.js'
import { RunQuickActionCommand } from './run_quick_action_command.js'

export const commands = {
  addKey: AddKeyCommand,
  runAction: RunActionCommand,
  runQuickAction: RunQuickActionCommand,
  checkConfig: CheckConfigCommand,
}
