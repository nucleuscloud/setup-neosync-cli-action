/**
 * Unit tests for the action's main functionality, src/main.ts
 *
 * These should be run as if the action was called from a workflow.
 * Specifically, the inputs listed in `action.yml` should be set as environment
 * variables following the pattern `INPUT_<INPUT_NAME>`.
 */

import { jest } from '@jest/globals'
import * as core from '../__fixtures__/core.js'
import * as os from '../__fixtures__/os.js'
import * as tc from '../__fixtures__/tool-cache.js'

jest.unstable_mockModule('@actions/core', () => core)
jest.unstable_mockModule('os', () => os)
jest.unstable_mockModule('@actions/tool-cache', () => tc)

// The module being tested should be imported dynamically. This ensures that the
// mocks are used in place of any actual dependencies.
const { run } = await import('../src/main.js')

describe('main.ts', () => {
  beforeEach(() => {
    //
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('sets the version output', async () => {
    // Set the action's inputs as return values from core.getInput()
    core.getInput.mockImplementation((name: string): string => {
      switch (name) {
        case 'version':
          return 'v0.0.18'
        default:
          return ''
      }
    })

    os.platform.mockImplementation(() => 'linux' as NodeJS.Platform)
    os.arch.mockImplementation(() => 'amd64' as NodeJS.Architecture)

    tc.downloadTool.mockImplementation(
      async (dlUrl: string): Promise<string> => {
        switch (dlUrl) {
          case 'https://github.com/nucleuscloud/neosync/releases/download/v0.0.18/neosync_0.0.18_linux_amd64.tar.gz':
            return Promise.resolve('fake-tar-path')
          default:
            return Promise.resolve('')
        }
      }
    )
    tc.extractTar.mockImplementation((tarPath: string): Promise<string> => {
      switch (tarPath) {
        case 'fake-tar-path':
          return Promise.resolve('/path/to/tarball')
        default:
          return Promise.resolve('')
      }
    })
    core.addPath.mockImplementation((cliPath: string): void => {
      switch (cliPath) {
        case '/path/to/tarball':
          return
        default:
          throw new Error('test: invalid cli path')
      }
    })

    await run()

    expect(core.setFailed).not.toHaveBeenCalled()
    expect(tc.downloadTool).toHaveBeenCalled()
    expect(tc.extractTar).toHaveBeenCalled()
    expect(core.addPath).toHaveBeenCalled()
  })
})
