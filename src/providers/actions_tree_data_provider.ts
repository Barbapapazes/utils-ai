import { type TreeDataProvider, TreeItem, TreeItemCollapsibleState } from 'vscode'
import type { AI, Action } from '../types/index.js'
import { Base } from '../core/Base.js'

type Element = ActionTreeItem | GitTreeItem | TextTreeItem

export class ActionsTreeDataProvider extends Base implements TreeDataProvider<ActionTreeItem> {
  getTreeItem(element: ActionTreeItem): ActionTreeItem {
    return element
  }

  getChildren(element?: Element): any {
    if (element instanceof TextTreeItem) {
      return
    }

    if (element instanceof AITreeItem) {
      return [
        ...Object.entries(element.ai).filter(([key]) => key !== 'name').map(([key, value]) => new TextTreeItem(`${key}: ${value}`)),
      ]
    }

    if (element instanceof GitTreeItem) {
      const children = []

      if (element.git?.commitMessageAfterAction) {
        children.push(new TextTreeItem(`After action: ${element.git.commitMessageAfterAction}`, `Commit after running the action using the message: ${element.git.commitMessageAfterAction}`))
      }

      if (element.git?.commitMessageBeforeAction) {
        children.push(new TextTreeItem(`Before action: ${element.git.commitMessageBeforeAction}`, `Commit before running the action using the message: ${element.git.commitMessageBeforeAction}`))
      }

      return children
    }

    if (element instanceof ActionTreeItem) {
      const action = element.getAction()

      const ai = this.getAI().find(({ name }) => name === action.ai)

      this.assert(ai, 'AI not found.')

      const children = [
        new TextTreeItem(`Prompt: ${action.prompt}`),
        new AITreeItem(`AI: ${action.ai}`, ai),
      ]

      if (action.git) {
        children.push(new GitTreeItem('Git: Enabled', action.git))
      }

      return children
    }

    const actions = this.getActions()

    return actions
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(action => new ActionTreeItem(action))
  }

  protected getActions(): Action[] {
    return this.getConfiguration().get('actions') ?? []
  }
}

export class ActionTreeItem extends TreeItem {
  protected action: Action

  contextValue = 'action'

  constructor(action: Action) {
    super(action.name, TreeItemCollapsibleState.Collapsed)

    this.action = action
  }

  getAction(): Action {
    return this.action
  }
}

export class TextTreeItem extends TreeItem {
  constructor(label: string, description?: string) {
    super(label, TreeItemCollapsibleState.None)

    this.description = description
  }
}

class AITreeItem extends TreeItem {
  ai: AI

  constructor(label: string, ai: AI) {
    super(label, TreeItemCollapsibleState.Collapsed)

    this.ai = ai
  }
}

class GitTreeItem extends TreeItem {
  git: Action['git']

  constructor(label: string, git: Action['git']) {
    super(label, TreeItemCollapsibleState.Collapsed)

    this.git = git
  }
}
