# Utils AI

Easily save and use **AI** prompts in VSCode.

1. Write prompts
2. Save AI configuration
3. Create actions (link a prompt to an ai)
4. Run actions from a single command

You can use Utils AI to **correct your texts**, **prepare tweets**, **do summaries**, **write descriptions**, and much more.

_This extension is only usable with OpenAI API. If you need another AI provider, please open an issue._

## Getting Started

First, you need to install the extension [Utils AI](https://marketplace.visualstudio.com/items?itemName=barbapapazes.utils-ai-vscode) from the marketplace.

Then, you'll have to configure the extension.

### Configuration

First, you'll have to add an API key (if your AI provider requires one). To do so, you can use the command `Utils AI: Add Key`. This will ask you for a name and a key. This key is securely stored in VSCode and not shared with anyone.

Then, you'll have to open you settings (JSON) with the command `Preferences: Open Settings (JSON)` to configure the extension.

The extension works with 3 parts:

- **Prompts**: a list of prompts you want to use

```json
{
  "utilsAi.prompts": [
    {
      "name": "<name>",
      "content": "<prompt>"
    }
  ]
}
```

- **AIs**: a list of AIs you want to use

```json
{
  "utilsAi.ais": [
    {
      "name": "<name>",
      "keyName": "<keyName>",
      "provider": "<provider>",
      "configuration": {
        "<config>": "<value>"
      }
    }
  ]
}
```

The `keyName` is the name of the key you added earlier with the command `Utils AI: Add Key`.

The `provider` is the name of the AI provider you want to use. For now, the only available provider is `openai` (or API compatible with OpenAI).

The `configuration` is the configuration of the provider and the content depends on the provider. For OpenAI, you can use the following configuration:

```json
{
  "openai": {
    "model": "<model>",
    "endpoint": "<endpoint>"
  }
}
```

- **Actions**: a list of actions you want to use, that link a prompt to an AI

```json
{
  "utilsAi.actions": [
    {
      "name": "<name>",
      "ai": "<aiName>",
      "prompt": "<promptName>",
      "target": "<target>",
      "git": {
        "commitMessageBeforeAction": "<commitMessage>",
        "commitMessageAfterAction": "<commitMessage>"
      }
    }
  ]
}
```

The `ai` is the name of the AI you added earlier.

The `prompt` is the name of the prompt you added earlier.

The `target` is optional and define the location where the result will be saved. It can replace the content used for the action using the keyword `replace` (default), append it at the end of the file for the action using the keyword `append`, or prepend it at the beginning of the file for the action using the keyword `prepend`. You can also use the keyword `newfile` to create a new draft with the result.

The `git` is an optional configuration to commit the file before and after the action. This can be useful to keep track of the changes made by the AI. The `commitMessageBeforeAction` and `commitMessageAfterAction` are the messages used for the commits. You can use the special keyword `__ask__` to ask for a commit message instead of a fixed one.

You can easily check that the configuration is correct by running the command `Utils AI: Check Config`. You can also visualize the configuration in the settings.

You can edit or delete the configuration using the commands `Utils AI: Edit <config>` and `Utils AI: Delete <config>`. This can also be done via the settings.

To remove a key, use the command `Utils AI: Remove Key`.

### Usage

To run an action, use the command `Utils AI: Run Action`. You will be prompted to select an action to run.

You can also set up a quick action to easily access a command from an editor (a top left button with the Utils AI logo will appear). To do so, open the settings and add the following configuration:

```json
{
  "utilsAi.quickAction": {
    "action": "<action>",
    "fileTypes": [
      "<fileType>" // e.g. ".md" for markdown files or ".txt" for text files
    ]
  }
}
```

## Examples

Some examples to give you an idea of what you can do with Utils AI and how to configure it.

### Correct a text

1. Create a prompt

```json
{
  "utilsAi.prompts": [
    {
      "name": "Markdown Spellchecker",
      "content": "You are an expert spell checker. You must correct the spelling mistakes in the following text written using markdown. You must not change the meaning of the text. You must not say anything other than the corrected text."
    }
  ]
}
```

2. Create an AI

```json
{
  "utilsAi.ai": [
    {
      "name": "GPT-4o",
      "keyName": "openai",
      "provider": "openai",
      "configuration": {
        "model": "gpt-4o"
      }
    }
  ]
}
```

3. Create an action

```json
{
  "utilsAi.actions": [
    {
      "name": "Markdown Spellchecker",
      "ai": "GPT-4o",
      "prompt": "Markdown Spellchecker",
      "target": "replace",
      "git": {
        "commitMessageBeforeAction": "content: save changes"
      }
    }
  ]
}
```

### Summarize a text

1. Create a prompt

```json
{
  "utilsAi.prompts": [
    {
      "name": "Summarize Text",
      "content": "You are an expert summarizer. You must summarize the following text. You must not change the meaning of the text. You must not say anything other than the summary."
    }
  ]
}
```

2. If you already create an AI at the previous example, you can reuse it. Otherwise, create an AI.

3. Create an action

```json
{
  "utilsAi.actions": [
    {
      "name": "Summarize Text",
      "ai": "GPT-4o",
      "prompt": "Summarize Text",
      "target": "newfile"
    }
  ]
}
```

Note that the AI name is the same as the previous example. This is because the AI is the same and can be reused. This is also true for the prompt.

### OpenAI-compatible AIs

Infomaniak provides an AI API compatible with OpenAI. You can easily use the OpenAI provider and change the endpoint to use Infomaniak's API.

```json
{
  "utilsAi.ai": [
    {
      "name": "Infomaniak AI",
      "keyName": "infomaniak",
      "provider": "openai",
      "configuration": {
        "model": "mixtral8x22b",
        "endpoint": "https://api.infomaniak.com/2/llm/{product_id}/chat/completions"
      }
    }
  ]
}
```

Remember to replace `{product_id}` with your Infomaniak product ID and to add a key with the name `infomaniak` (or any other name you want).

## Contributing

Please, open an issue if you have any question, suggestion or before adding a new feature.

You can locally develop the extension by cloning the repository and launching the `extension` configuration from the `Run and Debug` panel.

## License

[MIT](./LICENSE) - [barbapapazes](https://github.com/barbapapazes)
