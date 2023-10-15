# Utils AI

**AI tools for writers**

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]

## Features

- ✅ Spell Check
- ✅ Description Generator
- ✅ Multi Language Support (English, French)
- ✅ OpenAI API
- ✅ [VS Code extension](https://marketplace.visualstudio.com/items?itemName=barbapapazes.utils-ai-vscode)

## Usage

### Setup

```bash
npx utils-ai setup --key <openAIAccessKey>
```

Utils AI is based on OpenAI API. You need to get an access key to use it.

### Spell Check

```bash
npx utils-ai spell-check <file>
```

You can change the language by using `--language` option. Default is `en`. Available languages are `en` or `fr`.

### Description Generator

```bash
npx utils-ai description-generator <file>
```

You can change the language by using `--language` option. Default is `en`. Available languages are `en` or `fr`.

## Development

### Install Dependencies

```bash
pnpm install
```

### Build Sub

```bash
pnpm build:stub
```

Then, you'll be able to start the CLI with `pnpm run start`. Any changes in the `src` directory will be reflected in the CLI without to rebuild it, just rerun `pnpm run start`.

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/utils-ai/latest.svg?style=flat&colorA=18181B&colorB=38bdf8
[npm-version-href]: https://npmjs.com/package/utils-ai

[npm-downloads-src]: https://img.shields.io/npm/dm/utils-ai.svg?style=flat&colorA=18181B&colorB=38bdf8
[npm-downloads-href]: https://npmjs.com/package/utils-ai

[license-src]: https://img.shields.io/npm/l/utils-ai.svg?style=flat&colorA=18181B&colorB=38bdf8
[license-href]: https://npmjs.com/package/utils-ai
