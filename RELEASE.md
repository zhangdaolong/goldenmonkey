# 发布

创建标签并推送后，GitHub Actions 会构建资源文件，并将其上传到不同的存储平台。

## 预发布

```bash
$ git checkout master
$ pnpm bump
$ git push origin master --follow-tags
```

## 正式发布

将所有已准备好发布的内容合并到 `release` 分支，并更新版本号。

```bash
$ git checkout release
$ git merge master # or git merge v2.13.2
$ pnpm version minor
$ git push origin release --follow-tags
```

最后，将 `release` 分支合并回 `master`。

```bash
$ git checkout master
$ git merge release
```
