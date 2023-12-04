import * as core from '@actions/core';
import * as httpm from '@actions/http-client';
import os from 'os';

const REPO_BASE_URL = "https://github.com/nucleuscloud/neosync";

// arch in [arm, x32, x64...] (https://nodejs.org/api/os.html#os_os_arch)
// return value in [amd64, 386, arm]
function mapArch(arch: string): string {
  const mappings: Record<string, string> = {
    x32: '386',
    x64: 'amd64'
  }
  return mappings[arch] || arch
}

// os in [darwin, linux, win32...] (https://nodejs.org/api/os.html#os_os_platform)
// return value in [darwin, linux, windows]
function mapOS(ops: string): string {
  const mappings: Record<string, string> = {
    darwin: 'darwin',
    win32: 'windows'
  }
  return mappings[ops] || ops
}

interface GithubReleaseResponse {
  tag_name: string
  name: string
}

function getUrl(version: string): string {
  const ops = mapOS(os.platform())
  const arch = mapArch(os.arch())
  const filename = `neosync_${version}_${ops}_${arch}`
  const extension = 'tar.gz'
  return `${REPO_BASE_URL}/releases/download/v${version}/${filename}.${extension}`
}


export async function getDownloadUrl(version?: string): Promise<string> {
  if (!!version && version !== 'latest') {
    core.info(`Downloading Neosync CLI version ${version}`)
    return getUrl(version)
  }
  const latestVersion = await getLatestVersion()
  core.info(`Downloading latest Neosync CLI version ${latestVersion}.`)
  return getUrl(latestVersion);
}

async function getLatestVersion(): Promise<string> {
    try {
    const httpClient = new httpm.HttpClient('neosync-gh-action', [], {
      headers: {
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })
    const res = await httpClient.get(
      `${REPO_BASE_URL}/releases?per_page=1`
    )
    const body: string = await res.readBody()
    const releases: GithubReleaseResponse[] = JSON.parse(body)
    const latestRelease = releases[0]
    const latestVersion = latestRelease.tag_name || latestRelease.name
    if (!latestVersion) {
      core.setFailed('Failed to retrieve latest release')
    }

    return latestVersion.replace('v', '');
  } catch (err) {
    core.setFailed('Failed to resolve latest Neosync CLI version')
    throw err
  }
}
