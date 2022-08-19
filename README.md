# SA-SEL's GAS Library

## Summary

1. [Abstract](#abstract)
2. [Development](#Developtment)
   1. [Setup Dependencies](#setup)
   2. [Formatting and Conventions](#formatting)
   3. [Commit Messages](#commit)

## <a id="abstract"></a> Abstract

This repository provides general utilities for SA-SEL's **G**oogle **A**pps **S**cripts projects: functions, models, constants, etc. It is meant to be used as a submodule (see [Git Submodules](https://git-scm.com/book/en/v2/Git-Tools-Submodules)) in other projects.

## <a id="development"></a> Development

### <a id="setup"></a> Setup Dependencies

In order to contribute to this project and code locally using autocompletion, you must set it's dependencies (listed in `package.json`) up. To install them, run:

```bash
npm install
```

### <a id="formatting"></a> Formatting and Conventions

We're using ESLint for linting and Prettier for autoformatting. Download and configure their extensions for your IDE - e.g.: for VSCode there is [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) and [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint).

Aside from that, document your code with [TSDoc](https://tsdoc.org/)-style comments and use ES6 syntax.

Whenever possible, use the path alias `@lib` in import statements - unless you're in the same directory, in which case you'll use the relative path (`./path/to/module`) in order to avoid circular dependencies.

### <a id="commit"></a> Commit Messages

Write commit messages following this [style guide](https://commit.style/) and be sure to make use of `git commit --amend` and `--no-edit` when necessary. Write commit message that actually describe (summarize) the changes you made - do not commit stuff like `Fix bug`, `Fix`, `Fix bug 3`, `Fix bug (again)`.

Aside from that, commit messages in this repository should reference the tasks that brought here (see [this](https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/autolinked-references-and-urls#issues-and-pull-requests)). Start all your commit messages with `#<REPOSITORY_NAME>/<ISSUE_NUMBER> - `. For example, when working on the task `#7` in the repository `gas-hr`, you commit the creation of a view that previews an email: `gas-hr#7 - Create "email preview" view`.
