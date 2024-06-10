#!/usr/bin/env node
import fs from 'fs'
import path from 'path'
import process from 'process'
import minimist from 'minimist'
import { getHelp } from './lib/help.js'
import { parseConfigFile } from './lib/config.js'
import { parseInput } from './lib/input.js'
import { processFile } from './lib/processFile.js'

const argv = minimist(process.argv.slice(2), {
  string: ['input', 'stylesheet', 'config'],
  boolean: ['version', 'help'],
  alias: {
    i: 'input',
    s: 'stylesheet',
    c: 'config',
    v: 'version',
    h: 'help',
  },
  unknown: (unknownArgument) => {
    console.error(`Option '${unknownArgument}' not found.`)
  },
})

if (argv.version) {
  const packageJsonContent = fs.readFileSync('./package.json', 'utf8')
  const packageInfo = JSON.parse(packageJsonContent)

  console.log(packageInfo.version)
  process.exit(0)
}

if (argv.help) {
  getHelp()
  process.exit(0)
}

if (argv.input) {
  console.log(argv.input)
}

if (!argv.input && !argv.config) {
  getHelp()
  process.exit(0)
}

if (fs.existsSync(path.join(process.cwd(), 'dist'))) {
  try {
    fs.rmSync(path.join(process.cwd(), 'dist'), { recursive: true })
  } catch {
    console.error('Unable to delete ./dist directory.')
    process.exit(-1)
  }
}

try {
  fs.mkdirSync(path.join(process.cwd(), 'dist'))
} catch {
  console.error('Unable to create ./dist directory.')
  process.exit(-1)
}

if (argv.config) {
  const { input, stylesheet } = parseConfigFile(argv.config)
  argv.input = input
  argv.stylesheet = stylesheet
}

if (fs.existsSync(argv.input)) {
  const { files, currentDir } = parseInput(argv.input)
  if (files.length > 0) {
    files.forEach((file) => {
      processFile(file, currentDir, argv.stylesheet)
    })
  }
} else {
  console.error('File or directory not found!')
  process.exit(-1)
}
