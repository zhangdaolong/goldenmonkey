# Violentmonkey

[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/jinjaccalgkegednnccohejagnlnfdag.svg)](https://chrome.google.com/webstore/detail/violentmonkey/jinjaccalgkegednnccohejagnlnfdag)
[![Firefox Add-ons](https://img.shields.io/amo/v/violentmonkey.svg)](https://addons.mozilla.org/firefox/addon/violentmonkey)
[![Microsoft Edge Add-on](https://img.shields.io/badge/dynamic/json?label=microsoft%20edge%20add-on&query=%24.version&url=https%3A%2F%2Fmicrosoftedge.microsoft.com%2Faddons%2Fgetproductdetailsbycrxid%2Ffgmcfbgljpdcchbllcgecadeonjdcdhp)](https://microsoftedge.microsoft.com/addons/detail/fgmcfbgljpdcchbllcgecadeonjdcdhp)

Violentmonkey 为浏览器提供用户脚本支持。
它可运行在支持 [WebExtensions](https://developer.mozilla.org/en-US/Add-ons/WebExtensions) 的浏览器上。


## 提供给测试者的自动构建

在 beta 版本之间的变更会自动生成测试构建。你可以将其作为未打包扩展安装到 Chrome 和其他 Chromium 内核浏览器中，或在 Firefox 中作为临时扩展安装。

## 工作流

### 开发

安装 [Node.js](https://nodejs.org/) 和 PNPM。
Node.js 版本应与 `package.json` 中的 `"node"` 字段一致。

``` sh
# 安装依赖
$ pnpm ci

# 监听并编译
$ pnpm dev
```

然后从 `dist/` 目录加载扩展。

### 测试 + lint

``` sh
$ pnpm run ci
```

### 构建

要发布新版本，我们需要先构建资源并上传到各应用商店。

``` sh
# 构建正式发布版本
$ pnpm build

# 构建带有 update_url 的自托管发布版本
$ pnpm build:selfHosted
```

### 发布

发布流程请参见 [RELEASE](RELEASE.md)。

### 在 Chrome 中安装 Release 产物

1. 打开 [Releases 页面](https://github.com/zhangdaolong/goldenmonkey/releases)。
2. 下载最新 Release 中的扩展产物压缩包（通常为 `.zip`）。
3. 将压缩包解压到本地目录。
4. 在 Chrome 地址栏打开 `chrome://extensions/`。
5. 打开右上角“开发者模式”。
6. 点击“加载已解压的扩展程序”，选择第 3 步解压后的目录。
7. 安装完成后确认扩展已启用。

> 提示：对于未上架 Chrome Web Store 的产物，推荐使用“加载已解压的扩展程序”方式安装。
