# Violentmonkey

[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/jinjaccalgkegednnccohejagnlnfdag.svg)](https://chrome.google.com/webstore/detail/violentmonkey/jinjaccalgkegednnccohejagnlnfdag)
[![Firefox Add-ons](https://img.shields.io/amo/v/violentmonkey.svg)](https://addons.mozilla.org/firefox/addon/violentmonkey)
[![Microsoft Edge Add-on](https://img.shields.io/badge/dynamic/json?label=microsoft%20edge%20add-on&query=%24.version&url=https%3A%2F%2Fmicrosoftedge.microsoft.com%2Faddons%2Fgetproductdetailsbycrxid%3FproductId%3Djbfpobblfmipppbnjgfnjodcekmibkjf)](https://microsoftedge.microsoft.com/addons/detail/jbfpobblfmipppbnjgfnjodcekmibkjf)

Violentmonkey 为浏览器提供用户脚本支持。
它可运行在支持 [WebExtensions](https://developer.mozilla.org/en-US/Add-ons/WebExtensions) 的浏览器上。

更多详情请见[这里](https://violentmonkey.github.io/)。

加入我们的 Discord 服务器：

[![Discord](https://img.shields.io/discord/995346102003965952?label=discord&logo=discord&logoColor=white&style=for-the-badge)](https://discord.gg/XHtUNSm6Xc)

## 提供给测试者的自动构建

* [CI workflows](https://github.com/violentmonkey/violentmonkey/actions/workflows/ci.yml)（仅限已登录 github.com 的用户）
* [nightly.link latest](https://nightly.link/violentmonkey/violentmonkey/workflows/ci/master?preview)（如需下载其他构建，可将制品 URL 中的 `github.com` 替换为 `nightly.link`）

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

## 相关项目

- [Violentmonkey for Opera Presto](https://github.com/violentmonkey/violentmonkey-oex)
- [Violentmonkey for Maxthon](https://github.com/violentmonkey/violentmonkey-mx)
