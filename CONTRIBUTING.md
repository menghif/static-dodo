# Contributing

Thanks for your interest in the project!

## Requirements

Requirements to install and run:

- LTS version of [NodeJS](https://nodejs.org/en/)

## Installation

To install the dependencies, use:

```console
npm install
```

To create a symlink in the global folder, use:

```console
npm link
```

This will allow you to use `dodo-SSG` from anywhere in your system.

## Workflow

To make a change, please use the following GitHub workflow:

1. fork this repo on GitHub
1. clone your forked repo to your local machine, `git clone https://github.com/{your username}/dodo-SSG`
1. create a new branch off of the `main` branch, `git checkout -b {new branch name} main`
1. make your changes and save
1. check to see which files have changed, `git status`
1. stage these changed files in git, `git add file1 file2 ...`
1. commit your changes, `git commit -m "Made the following changes..."`
1. push your commits and branch to your GitHub fork, `git push origin {new branch name}`
1. [create a Pull Request](https://docs.github.com/en/github/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request) on GitHub
1. add a description about what you changed and submit

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

This project uses [Jest]() for testing. You can run all the tests with the command:

```console
npm test
```

To run a specific test (for example for file name `foo.js`):

```console
npm test foo
```

Tests are found in files that end in `.test.js`. You can follow the Jest docs for the basics on how to to get started writing tests.
