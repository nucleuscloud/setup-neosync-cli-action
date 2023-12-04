# Setup Neosync CLI Action

[![GitHub Super-Linter](https://github.com/nucleuscloud/setup-neosync-cli-action/actions/workflows/linter.yml/badge.svg)](https://github.com/super-linter/super-linter)
![CI](https://github.com/nucleuscloud/setup-neosync-cli-action/actions/workflows/ci.yml/badge.svg)
[![Check dist/](https://github.com/nucleuscloud/setup-neosync-cli-action/actions/workflows/check-dist.yml/badge.svg)](https://github.com/nucleuscloud/setup-neosync-cli-action/actions/workflows/check-dist.yml)
[![CodeQL](https://github.com/nucleuscloud/setup-neosync-cli-action/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/nucleuscloud/setup-neosync-cli-action/actions/workflows/codeql-analysis.yml)
[![Coverage](./badges/coverage.svg)](./badges/coverage.svg)

The `nucleuscloud/setup-neosync-cli-action` is a Typescript action that sets up Neosync CLI in your GitHub Actions workflow.

- Downloads a specific version of Neosync CLI and adds it to the `PATH`.

After you've used the action, subsequent steps in the same job can run Nucleus commands using [the GitHub Actions `run` syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idstepsrun). This allows Neosync commands to work like they do on your local command line.

## Usage

### Neosync CLI

#### Download the latest Neosync CLI

```yaml
name: ci

on:
  push:
    branches: main

jobs:
  whoami:
    runs-on: ubuntu-latest
    steps:
      - name: Download Neosync CLI
        uses: nucleuscloud/setup-neosync-cli-action@v1
      - name: Whoami
        run: neosync whoami
```

#### Download Neosync CLI at a specific version

```yaml
name: ci

on:
  push:
    branches: main

jobs:
  whoami:
    runs-on: ubuntu-latest
    steps:
      - name: Download Neosync CLI
        uses: nucleuscloud/setup-neosync-cli-action@v1
        with:
          version: v0.0.18
      - name: Whoami
        run: neosync whoami
```

#### Provide a Neosync API Key

```yaml
name: ci

on:
  push:
    branches: main

jobs:
  whoami:
    runs-on: ubuntu-latest
    steps:
      - name: Download Neosync CLI
        uses: nucleuscloud/setup-neosync-cli-action@v1
      - name: Whoami
        run: neosync whoami
        env:
          NEOSYNC_API_KEY: ${{ secrets.NEOSYNC_API_KEY }}
```

## Customizing

### inputs

| Name      | Type   | Default | Required | Description         |
| --------- | ------ | ------- | -------- | ------------------- |
| `version` | String | latest  | false    | Neosync CLI version |

## Publishing a new release

This project includes a helper script designed to streamline the process of
tagging and pushing new releases for GitHub Actions.

GitHub Actions allows users to select a specific version of the action to use,
based on release tags. Our script simplifies this process by performing the
following steps:

1. **Retrieving the latest release tag:** The script starts by fetching the most
   recent release tag by looking at the local data available in your repository.
1. **Prompting for a new release tag:** The user is then prompted to enter a new
   release tag. To assist with this, the script displays the latest release tag
   and provides a regular expression to validate the format of the new tag.
1. **Tagging the new release:** Once a valid new tag is entered, the script tags
   the new release.
1. **Pushing the new tag to the remote:** Finally, the script pushes the new tag
   to the remote repository. From here, you will need to create a new release in
   GitHub and users can easily reference the new tag in their workflows.
