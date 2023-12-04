/**
 * Unit tests for the action's main functionality, src/main.ts
 *
 * These should be run as if the action was called from a workflow.
 * Specifically, the inputs listed in `action.yml` should be set as environment
 * variables following the pattern `INPUT_<INPUT_NAME>`.
 */

import * as core from '@actions/core'
import * as tc from '@actions/tool-cache'
import os from 'os'
import * as main from '../src/main'

// // Mock the action's main function
const runMock = jest.spyOn(main, 'run')

jest.mock('os')

let errorMock: jest.SpyInstance
let getInputMock: jest.SpyInstance
let addPathMock: jest.SpyInstance
let downloadToolMock: jest.SpyInstance
let extractTarMock: jest.SpyInstance

describe('action', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    getInputMock = jest.spyOn(core, 'getInput').mockImplementation()
    addPathMock = jest.spyOn(core, 'addPath').mockImplementation()
    errorMock = jest.spyOn(core, 'setFailed').mockImplementation()
    downloadToolMock = jest.spyOn(tc, 'downloadTool').mockImplementation()
    extractTarMock = jest.spyOn(tc, 'extractTar').mockImplementation()

    os.platform = jest.fn().mockReturnValue('linux')
    os.arch = jest.fn().mockReturnValue('amd64')
  })

  it('sets the version output', async () => {
    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation((name: string): string => {
      switch (name) {
        case 'version':
          return 'v0.0.18'
        default:
          return ''
      }
    })

    downloadToolMock.mockImplementation((dlUrl: string): string => {
      switch (dlUrl) {
        case 'https://github.com/nucleuscloud/neosync/releases/download/v0.0.18/neosync_0.0.18_linux_amd64.tar.gz':
          return 'fake-tar-path'
        default:
          return ''
      }
    })
    extractTarMock.mockImplementation((tarPath: string): string => {
      switch (tarPath) {
        case 'fake-tar-path':
          return '/path/to/tarball'
        default:
          return ''
      }
    })
    addPathMock.mockImplementation((cliPath: string): void => {
      switch (cliPath) {
        case '/path/to/tarball':
          return
        default:
          throw new Error('test: invalid cli path')
      }
    })

    await main.run()
    expect(runMock).toHaveReturned()
    expect(errorMock).not.toHaveBeenCalled()
    expect(downloadToolMock).toHaveBeenCalled()
    expect(extractTarMock).toHaveBeenCalled()
    expect(addPathMock).toHaveBeenCalled()
  })
})
