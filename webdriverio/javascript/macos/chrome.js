import { remote } from 'webdriverio';

// if called from Dogu Routine, the following environment variables will be injected from Dogu Routine.
// if you want to run this script locally, please set your access key here.
const token = process.env.DOGU_TOKEN || 'INSERT_YOUR_TOKEN';
const organizationId = process.env.DOGU_ORGANIZATION_ID || 'INSERT_YOUR_ORGANIZATION_ID';
const projectId = process.env.DOGU_PROJECT_ID || 'INSERT_YOUR_PROJECT_ID';
const apiBaseUrl = process.env.DOGU_API_BASE_URL || 'https://api.dogutech.io';

function parseUrl(url) {
  const regex = /^(https?):\/\/([^:\/\s]+)(:([0-9]+))?\/?/i;
  const matches = url.match(regex);
  if (!matches) {
    throw new Error(`Invalid apiBaseUrl: ${url}`);
  }
  const [, protocol, hostname, , port] = matches;
  if (typeof protocol !== 'string') {
    throw new Error(`Invalid protocol: ${protocol}`);
  }
  if (typeof hostname !== 'string') {
    throw new Error(`Invalid hostname: ${hostname}`);
  }
  if (port && typeof port !== 'string') {
    throw new Error(`Invalid port: ${port}`);
  }
  if (port) {
    const portNumber = parseInt(port, 10);
    if (Number.isNaN(portNumber)) {
      throw new Error(`Invalid port: ${port}`);
    }
    return { protocol, hostname, port: portNumber };
  }
  return { protocol, hostname, port: protocol === 'https' ? 443 : 80 };
}

const { protocol, hostname, port } = parseUrl(apiBaseUrl);

const driver = await remote({
  logLevel: 'debug',
  protocol,
  hostname,
  port,
  path: '/remote/wd/hub',
  capabilities: {
    "dogu:options": {
      token,
      organizationId,
      projectId,
      runsOn: 'macos',
      browserName: 'chrome',
    },
  },
});

await driver.url('https://dogutech.io');
await driver.$$('xpath://*[contains(text(), "dogu")]');
await driver.deleteSession();
