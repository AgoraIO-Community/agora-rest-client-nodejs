# Agora REST Client for Node.js

<p>
<img alt="NPM Version" src="https://img.shields.io/npm/v/agora-rest-client">
<img alt="GitHub License" src="https://img.shields.io/github/license/AgoraIO-Community/agora-rest-client-nodejs">
<img alt="GitHub" src="https://img.shields.io/github/v/release/AgoraIO-Community/agora-rest-client-nodejs">
<img alt="GitHub Issues or Pull Requests" src="https://img.shields.io/github/issues-pr/AgoraIO-Community/agora-rest-client-nodejs">
</p>

`agora-rest-client-nodejs`是在 Node.js 平台用 TypeScript 语言编写的一个开源项目，专门为 Agora REST API 设计。它包含了 Agora 官方提供的 REST
API 接口的包装和内部实现，可以帮助开发者更加方便的集成服务端 Agora REST API。

> 注意： 该 SDK 经过一些测试以确保其基本功能正常运作。然而，由于软件开发的复杂性，我们无法保证它是完全没有缺陷的。
>
>该SDK目前可能存在一些潜在的 BUG 或不稳定性。我们鼓励社区的开发者和用户积极参与，共同改进这个项目。

## 特性

* 封装了 Agora REST API 的请求和响应处理，简化与 Agora REST API 的通信流程
* 当遇到 DNS 解析失败、网络错误或者请求超时等问题的时候，提供了自动切换最佳域名的能力，以保障请求 REST API 服务的可用性
* 提供了易于使用的 API，可轻松地实现调用 Agora REST API 的常见功能，如开启云录制、停止云录制等
* 基于 Node.js 平台，具有异步性、高性能和可扩展性

## 支持的服务

* [云端录制 Cloud Recording](src/services/cloudrecording/README.md)

## 环境准备

* [Node.js 18 或以上版本](https://nodejs.org/en)
* 在声网 [Console 平台](https://console.shengwang.cn/)申请的 App ID 和 App Certificate
* 在声网 [Console 平台](https://console.shengwang.cn/)的 Basic Auth 认证信息
* 在声网 [Console 平台](https://console.shengwang.cn/)开启相关的服务能力

## 安装

首先，在`package.json`文件中添加 REST Client 依赖：

```shell
npm i agora-rest-client
```

## 使用示例

以调用云录制服务为例：

```typescript
import {
  DomainArea,
  BasicCredential,
  CloudRecordingClient,
  AcquireResourceRes,
  StartResourceRes,
  RecordingRequestChannelTypeEnum,
  QueryMixHLSAndMP4RecordingResourceRes,
} from "agora-rest-client";

const appId = "";
const cname = "";
const uid = "";
const username = "";
const password = "";
const token = "";

if (!appId || !cname || !uid || !username || !password) {
  console.error("Required variables are missing");
  process.exit(1);
}

const credential = new BasicCredential(username, password);

const storageConfig = {
  vendor: parseInt("0", 10),
  region: parseInt("0", 10),
  bucket: "",
  accessKey: "",
  secretKey: "",
  fileNamePrefix: ["recordings"],
};

if (
  !storageConfig.vendor ||
  !storageConfig.region ||
  !storageConfig.bucket ||
  !storageConfig.accessKey ||
  !storageConfig.secretKey
) {
  console.error("Required storage configuration variables are missing");
  process.exit(1);
}

(async (): Promise<void> => {
  const cloudRecordingClient = new CloudRecordingClient({
    appId,
    credential,
    // Specify the region where the server is located.
    // Optional values are CN, NA, EU, AP, and the client will automatically
    // switch to use the best domain name according to the configured region
    domainArea: DomainArea.CN,
  });

  // Acquire resource
  let acquireResourceRes: AcquireResourceRes;
  try {
    acquireResourceRes = await cloudRecordingClient
      .mixScenario()
      .acquire(cname, uid, {
        resourceExpiredHour: 1,
      });
  } catch (error) {
    console.error("Failed to acquire resource", error);
    return;
  }

  if (!acquireResourceRes.resourceId) {
    console.error("Resource ID is missing");
    return;
  }

  console.info(
    `acquire resource success,res:${JSON.stringify(acquireResourceRes)}`
  );

  // Start resource
  let startResourceRes: StartResourceRes;
  try {
    startResourceRes = await cloudRecordingClient
      .mixScenario()
      .start(cname, uid, acquireResourceRes.resourceId, {
        token,
        recordingConfig: {
          channelType: RecordingRequestChannelTypeEnum.Live,
          streamTypes: 2,
          maxIdleTime: 30,
          audioProfile: 2,
          transcodingConfig: {
            width: 640,
            height: 480,
            fps: 15,
            bitrate: 800,
            mixedVideoLayout: 0,
            backgroundColor: "#000000",
          },
          subscribeAudioUids: ["#allstream#"],
          subscribeVideoUids: ["#allstream#"],
        },

        recordingFileConfig: {
          avFileType: ["hls", "mp4"],
        },
        storageConfig,
      });
  } catch (error) {
    console.error("Failed to start resource", error);
    return;
  }

  if (!startResourceRes.sid) {
    console.error("SID is missing");
    return;
  }

  console.info(
    `start resource success,res:${JSON.stringify(startResourceRes)}`
  );

  await new Promise((resolve) => setTimeout(resolve, 10000));

  // Query resource
  let queryResourceRes: QueryMixHLSAndMP4RecordingResourceRes;

  try {
    queryResourceRes = await cloudRecordingClient
      .mixScenario()
      .queryHLSAndMP4(acquireResourceRes.resourceId, startResourceRes.sid);
  } catch (error) {
    console.error("Failed to query resource", error);
    return;
  }

  if (!queryResourceRes.serverResponse) {
    console.error("Query resource serverResponse is missing");
    return;
  }
  console.info(
    `query resource success,res:${JSON.stringify(queryResourceRes)}`
  );

  await new Promise((resolve) => setTimeout(resolve, 3000));

  // Stop resource
  try {
    await cloudRecordingClient
      .mixScenario()
      .stop(
        cname,
        uid,
        acquireResourceRes.resourceId,
        startResourceRes.sid,
        true
      );
  } catch (error) {
    console.error("Failed to stop resource", error);
    return;
  }

  console.info(`stop resource success,res:${JSON.stringify(startResourceRes)}`);
})();
```

更多的示例可在 [Example](./examples) 查看

## 集成遇到困难，该如何联系声网获取协助

> 方案1：如果您已经在使用声网服务或者在对接中，可以直接联系对接的销售或服务
>
> 方案2：发送邮件给 [support@agora.io](mailto:support@agora.io) 咨询
>
> 方案3：扫码加入我们的微信交流群提问
>
> <img src="https://download.agora.io/demo/release/SDHY_QA.jpg" width="360" height="360">
---

## 贡献

本项目欢迎并接受贡献。如果您在使用中遇到问题或有改进建议，请提出 issue 或向我们提交 Pull Request。

# SemVer 版本规范

本项目使用语义化版本号规范 (SemVer) 来管理版本。格式为 MAJOR.MINOR.PATCH。

* MAJOR 版本号表示不向后兼容的重大更改。
* MINOR 版本号表示向后兼容的新功能或增强。
* PATCH 版本号表示向后兼容的错误修复和维护。
  有关详细信息，请参阅 [语义化版本](https://semver.org/lang/zh-CN/) 规范。

## 参考

* [Agora API 文档](https://doc.shengwang.cn/)

## 许可证

该项目使用MIT许可证，详细信息请参阅LICENSE文件。
