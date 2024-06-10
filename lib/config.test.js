import { vitest, expect, test } from 'vitest'
import process from 'process'
import { parseConfigFile } from './config.js'

test('config file name not in json format should exit', () => {
  const mockExit = vitest.spyOn(process, 'exit').mockImplementation((num) => {
    throw new Error('process.exit: ' + num)
  })
  const configFile = 'config.txt'
  expect(() => {
    parseConfigFile(configFile)
  }).toThrow()
  expect(mockExit).toHaveBeenCalledWith(1)
  mockExit.mockRestore()
})

test('config file name that is not a string should exit', () => {
  const mockExit = vitest.spyOn(process, 'exit').mockImplementation((num) => {
    throw new Error('process.exit: ' + num)
  })
  const configFile = 3
  expect(() => {
    parseConfigFile(configFile)
  }).toThrow()
  expect(mockExit).toHaveBeenCalledWith(1)
  mockExit.mockRestore()
})

test('config file name that is not a string should exit', () => {
  const mockExit = vitest.spyOn(process, 'exit').mockImplementation((num) => {
    throw new Error('process.exit: ' + num)
  })
  const configFile = 3
  expect(() => {
    parseConfigFile(configFile)
  }).toThrow()
  expect(mockExit).toHaveBeenCalledWith(1)
  mockExit.mockRestore()
})
