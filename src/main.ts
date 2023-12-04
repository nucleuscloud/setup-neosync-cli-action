import * as core from '@actions/core';
import { downloadTool, extractTar } from '@actions/tool-cache';
import { getInput } from './inputs';
import { getDownloadUrl } from './util';

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const inputs = getInput();

    // Download the specific version of the tool
    const pathToTarball = await downloadTool(await getDownloadUrl(inputs.version));

    // Extract the tarball onto the runner
    const pathToCli = await extractTar(pathToTarball);

    // Expose the tool by adding it to the PATH
    core.addPath(pathToCli);
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
