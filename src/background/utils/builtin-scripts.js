import { parseMeta } from './script';

export const topWarKeeperScript = "// ==UserScript==\n// @name         口袋奇兵网页版免二次扫码 (凭据自启版)\n// @namespace    https://github.com/zhangdaolong/tampermonkey\n// @version      16.1.0\n// @description  利用原生 saveServerToken 初始化会话变量 U，实现刷新免扫码直入主城\n// @author       zhangdaolong\n// @match        *://warh5.rivergame.net/webgame/*\n// @run-at       document-start\n// @grant        GM_registerMenuCommand\n// @grant        GM_unregisterMenuCommand\n// ==/UserScript==\n\n(function () {\n    'use strict';\n\n    const LOG_PREFIX = '[TopWar-Keeper]';\n    const log = (...args) => console.log(LOG_PREFIX, ...args);\n\n    const injectedCode = `\n    (function() {\n        const LOG_PREFIX = '${LOG_PREFIX}';\n        const log = (...args) => console.log(LOG_PREFIX, ...args);\n\n        // 1. 确保本地存储具备静默登录所需的基础字段\n        try {\n            if (!localStorage.getItem('topwar_app_platformSID')) {\n                localStorage.setItem('topwar_app_platformSID', '\"webgame\"');\n            }\n            if (!localStorage.getItem('topwar_app_channel')) {\n                localStorage.setItem('topwar_app_channel', '\"webgame_webgameCn\"');\n            }\n        } catch (e) {}\n\n        let restored = false;\n\n        function tryRestoreSession() {\n            if (restored) return;\n\n            const TOKEN = localStorage.getItem('token') ||\n                          localStorage.getItem('serverInfoToken') ||\n                          localStorage.getItem('user_token') ||\n                          localStorage.getItem('topwar_token');\n\n            if (!TOKEN) return;\n\n            if (window.__require) {\n                try {\n                    const pcMod = window.__require('PlatformCore');\n                    const inst = pcMod?.instance || pcMod?.Instance || pcMod?.default?.instance;\n\n                    if (inst && typeof inst.saveServerToken === 'function') {\n                        inst.saveServerToken(TOKEN);\n                        restored = true;\n                        log('✅ 成功通过 saveServerToken 恢复内存凭据 U！');\n                    }\n                } catch (e) {}\n            }\n        }\n\n        // 高频轮询检测 PlatformCore 模块装载\n        let count = 0;\n        const timer = setInterval(() => {\n            count++;\n            tryRestoreSession();\n            if (restored || count > 60) {\n                clearInterval(timer);\n            }\n        }, 100);\n\n        window.addEventListener('load', () => {\n            setTimeout(tryRestoreSession, 500);\n        });\n    })();\n    `;\n\n    const TOKEN_KEYS = ['token', 'serverInfoToken', 'user_token', 'topwar_token'];\n    const hasCredentials = () => {\n        try { return TOKEN_KEYS.some((k) => !!localStorage.getItem(k)); } catch (e) { return false; }\n    };\n    let menuId = null;\n    const resetLogin = () => {\n        if (!confirm('确定要重置微信登录吗？重置后下次登录需要重新扫码。')) return;\n        try {\n            TOKEN_KEYS.forEach((k) => localStorage.removeItem(k));\n            sessionStorage.clear();\n        } catch (e) {}\n        alert('已重置微信登录，下次登录需要重新扫码。');\n        location.reload();\n    };\n    const syncMenu = () => {\n        const logged = hasCredentials();\n        if (logged && menuId === null) {\n            menuId = GM_registerMenuCommand('重置微信登录', resetLogin);\n            if (menuId === undefined || menuId === null) menuId = true;\n        } else if (!logged && menuId !== null) {\n            if (typeof GM_unregisterMenuCommand === 'function' && menuId !== true) GM_unregisterMenuCommand(menuId);\n            menuId = null;\n        }\n    };\n    if (typeof GM_registerMenuCommand === 'function') {\n        syncMenu();\n        setInterval(syncMenu, 2000);\n    }\n\n    const script = document.createElement('script');\n    script.textContent = injectedCode;\n    (document.head || document.documentElement).appendChild(script);\n    script.remove();\n})();\n";

export const builtinScripts = [topWarKeeperScript];

/**
 * @param {Function} parseScript
 * @param {Function} getScript
 */
export async function installBuiltinScripts(parseScript, getScript) {
  for (const code of builtinScripts) {
    try {
      const meta = parseMeta(code);
      if (!meta || getScript({ meta })) continue;
      await parseScript({
        code,
        config: { enabled: 1 },
        custom: {},
        message: '',
      });
    } catch (err) {
      console.error('Failed to install builtin script', err);
    }
  }
}
