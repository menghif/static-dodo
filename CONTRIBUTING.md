# Contributing

Thanks for your interest in the project!

## Requirements

Requirements to install and run:

- LTS version of [NodeJS](https://nodejs.org/en/)

## Installation

Install the dependencies:

```console
npm install
```

Then run the program:

```console
node static-dodo [options]
```

## Workflow

To make a change, please use the following GitHub workflow:

1. Fork this repo on GitHub.
1. Clone your forked repo to your local machine: `git clone https://github.com/{your username}/static-dodo`
1. Create a new branch off of the `main` branch: `git checkout -b {new branch name} main`
1. Make your changes and save.
1. Check to see which files have changed: `git status`
1. Stage these changed files in git: `git add file1 file2 ...`
1. Commit your changes: `git commit -m "Made the following changes..."`
1. Push your commits and branch to your GitHub fork: `git push origin {new branch name}`
1. [create a Pull Request](https://docs.github.com/en/github/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request) on GitHub.
1. Add a description about what you changed and submit.

## Code format

The project uses [prettier](https://prettier.io) to have a common format for all source code.
If you use [VS Code](https://code.visualstudio.com) prettier will be run every time you save a file.

You can run the following to run prettier from the terminal:

```console
npm run prettier
```

or to avoid overwriting files you can check if the files are already formatted:

```console
npm run prettier-check
```

## Code linting

The project uses [ESLint](https://eslint.org) to find mistakes in the code.

You can run the following to run ESLint from the terminal and show the errors:

```console
npm run eslint
```

or to fix the errors that ESLint knows how to fix:

```console
npm run eslint-fix
```

## Code Testing

This project uses [Vitest](https://vitest.dev) for testing. You can run all the tests with the command:

```console
npm test
```

To run a specific test (for example for file name `foo.js`):

```console
npm test foo
```

Tests are found in files that end in `.test.js`. You can follow the Vitest [docs](https://vitest.dev/guide/) for the basics on how to to get started writing tests.
