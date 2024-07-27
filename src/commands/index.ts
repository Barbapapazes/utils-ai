import { AddKeyCommand } from './add_key_command.js'
import { CheckConfigCommand } from './check_config_command.js'
import { RunActionCommand } from './run_action_command.js'

export const commands = {
  addKey: AddKeyCommand,
  runAction: RunActionCommand,
  checkConfig: CheckConfigCommand,
}
