import * as core from '@actions/core'

export interface Input {
  version?: string
}

export function getInput(): Input {
  return {
    version: core.getInput('version')
  }
}
