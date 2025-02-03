import { expect, jest, test } from '@jest/globals'
import * as os from '../__fixtures__/os.js'

jest.unstable_mockModule('os', () => os)

// The module being tested should be imported dynamically. This ensures that the
// mocks are used in place of any actual dependencies.
const { getDownloadUrl } = await import('../src/util.js')

describe('util.ts', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  test('get latest download url', async () => {
    os.platform.mockImplementation(() => 'linux' as NodeJS.Platform)
    os.arch.mockImplementation(() => 'amd64' as NodeJS.Architecture)

    await expect(getDownloadUrl('latest')).resolves.toBeTruthy()
  })

  test('get specific version download url', async () => {
    const version = '0.0.26'
    const ops = 'linux' as NodeJS.Platform
    const arch = 'amd64' as NodeJS.Architecture
    const filename = `neosync_${version}_${ops}_${arch}`

    os.platform.mockImplementation(() => ops)
    os.arch.mockImplementation(() => arch)

    const url = await getDownloadUrl(version)
    expect(url).toEqual(
      `https://github.com/nucleuscloud/neosync/releases/download/v${version}/${filename}.tar.gz`
    )
  })
})
