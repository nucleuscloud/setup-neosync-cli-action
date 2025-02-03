import { jest } from '@jest/globals'
import type * as os from 'os'

export const platform = jest.fn<typeof os.platform>()
export const arch = jest.fn<typeof os.arch>()
