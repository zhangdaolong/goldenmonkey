import { ErrorCode, createClient, ToolCallError } from '@violentmonkey/mcp-client';
import browser from '@/common/browser';
import { extensionOptionsPage } from '@/common/safe-globals';
import {
  getScriptById, getScripts, parseScript, removeScripts, updateScriptInfo,
} from './db';
import { addOwnCommands } from './init';
import { aliveScripts, removedScripts } from './script';
import storage, { S_CODE } from './storage';

export const MCP_CONNECT_URL = 'https://goldmonkey.github.io/mcp_connect.html';
const HOST = '127.0.0.1';

/** @type {{ port: number, token: string } | null} */
let pending = null;
let client = null;
let status = 'idle';
let current = null;

addOwnCommands({
  McpGetState: () => ({
    status,
    pending: pending && { port: pending.port },
    port: current?.port,
  }),
  McpApprove() {
    if (!pending) return;
    connect(pending);
    pending = null;
  },
  McpReject() {
    pending = null;
  },
  McpDisconnect() {
    client?.close();
    client = current = null;
    status = 'idle';
  },
});

/** Called when the user navigates to the connect URL. */
export function requestMcpConnection(url) {
  const params = new URL(url).searchParams;
  const port = +params.get('port');
  const token = params.get('token');
  if (!(port > 0 && port < 65536) || !token) return false;
  pending = { port, token };
  return true;
}

export function openMcpAuthorization(tabId) {
  return browser.tabs.update(tabId, { url: `${extensionOptionsPage}#settings/mcp` });
}

function connect({ port, token }) {
  client?.close();
  current = { port };
  client = createClient({
    host: HOST,
    port,
    token,
    info: { name: 'Goldmonkey', version: __.VM_VER },
  });
  registerTools(client);
  client.on('status', s => { status = s; });
  client.connect();
}
