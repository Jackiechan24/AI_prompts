# GitHub 网页源码发布

源码仓库：https://github.com/Jackiechan24/AI_prompts

本仓库仅包含网页源码、场景内容、测试和开发文档，采用 MIT 许可证。

## 提交更新

在已克隆的仓库目录执行：

```sh
git status
git add .
git commit -m "Publish Jiyong web source"
git push origin main
```

首次推送需要完成 GitHub 登录，不要把令牌写入文件或远程地址。
公开前检查环境文件、日志、密钥和业务资料，不提交依赖目录或构建产物。

## 源码打包

运行 `npm run release:source` 生成网页源码目录与 ZIP。通过 GitHub 上传文件时上传解压后的源码，不要只上传 ZIP。

## 在线访问

GitHub 分享源码，不会自动运行 Next.js。在线访问需另行部署并绑定域名，localhost 不是公网地址。实际部署后再补充演示链接。
