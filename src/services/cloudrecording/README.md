# 云端录制服务
## 服务简介
云端录制是声网为音视频通话和直播研发的录制组件，提供 RESTful API 供开发者实现录制功能，并将录制文件存至第三方云存储。云端录制有稳定可靠、简单易用、成本可控、方案灵活、支持私有化部署等优势，是在线教育、视频会议、金融监管、客户服务场景的理想录制方案。

## 环境准备

- 获取声网App ID -------- [声网Agora - 文档中心 - 如何获取 App ID](https://docs.agora.io/cn/Agora%20Platform/get_appid_token?platform=All%20Platforms#%E8%8E%B7%E5%8F%96-app-id)

  > - 点击创建应用
      >
      >   ![](https://accktvpic.oss-cn-beijing.aliyuncs.com/pic/github_readme/create_app_1.jpg)
  >
  > - 选择你要创建的应用类型
      >
      >   ![](https://accktvpic.oss-cn-beijing.aliyuncs.com/pic/github_readme/create_app_2.jpg)

- 获取App 证书 ----- [声网Agora - 文档中心 - 获取 App 证书](https://docs.agora.io/cn/Agora%20Platform/get_appid_token?platform=All%20Platforms#%E8%8E%B7%E5%8F%96-app-%E8%AF%81%E4%B9%A6)

  > 在声网控制台的项目管理页面，找到你的项目，点击配置。
  > ![](https://fullapp.oss-cn-beijing.aliyuncs.com/scenario_api/callapi/config/1641871111769.png)
  > 点击主要证书下面的复制图标，即可获取项目的 App 证书。
  > ![](https://fullapp.oss-cn-beijing.aliyuncs.com/scenario_api/callapi/config/1637637672988.png)

- 开启云录制服务
  > ![](https://fullapp.oss-cn-beijing.aliyuncs.com/scenario_api/callapi/config/rtm_config1.jpg)
  > ![](https://fullapp.oss-cn-beijing.aliyuncs.com/scenario_api/callapi/config/rtm_config2.jpg)  
  > ![](https://fullapp.oss-cn-beijing.aliyuncs.com/agora-rest-client/go/open_cloud_recording.png)

## API 接口调用示例
### 获取云端录制资源
> 在开始云端录制之前，你需要调用 acquire 方法获取一个 Resource ID。一个 Resource ID 只能用于一次云端录制服务。

需要设置的参数有：
- appId: 声网的项目 AppID
- username: 声网的Basic Auth认证的用户名
- password: 声网的Basic Auth认证的密码
- cname: 频道名
- uid: 用户 UID
- 更多 clientRequest中的参数见 [Acquire](https://doc.shengwang.cn/doc/cloud-recording/restful/cloud-recording/operations/post-v1-apps-appid-cloud_recording-acquire) 接口文档

通过调用`acquire`方法来实现获取云端录制资源

```typescript
const appId = ''
const cname = ''
const uid = ''
const username = ''
const password = ''

const cloudRecordingClient = new CloudRecordingClient({
            appId: appId,
            credential: new BasicCredential(username, password),
            domainArea: DomainArea.CN,
        });

let acquireResourceRes: AcquireResourceRes
try {
    acquireResourceRes = await cloudRecordingClient
        .individualScenario()
        .acquire(cname, uid, false, {
            resourceExpiredHour: 1,
        })
} catch (error) {
    console.error('Failed to acquire resource:', error)
    return
}

const { resourceId } = acquireResourceRes

if (resourceId === undefined) {
    console.error('Failed to acquire resource:', acquireResourceRes)
    return
}

console.log('Acquire resource successfully, response:', acquireResourceRes)

```

### 开始云端录制
> 通过 acquire 方法获取云端录制资源后，调用 start 方法开始云端录制。

需要设置的参数有：
- cname: 频道名
- uid: 用户 UID
- resourceId: 云端录制资源ID
- mode: 云端录制模式
- storageConfig: 存储配置
- 更多 clientRequest中的参数见 [Start](https://doc.shengwang.cn/doc/cloud-recording/restful/cloud-recording/operations/post-v1-apps-appid-cloud_recording-resourceid-resourceid-mode-mode-start) 接口文档

通过调用`start`方法来实现开始云端录制

```typescript
let startResourceRes: StartResourceRes
try {
    startResourceRes = await cloudRecordingClient
        .individualScenario()
        .start(cname, uid, resourceId, {
            token,
            recordingConfig: {
                channelType: RecordingRequestChannelTypeEnum.Live,
                streamTypes: 2,
                maxIdleTime: 30,
                subscribeAudioUids: ['#allstream#'],
                subscribeVideoUids: ['#allstream#'],
                subscribeUidGroup: 0,
            },
            recordingFileConfig: {
                avFileType: ['hls'],
            },
            storageConfig,
        })
} catch (error) {
    console.error('Failed to start resource:', error)
    return
}

const { sid } = startResourceRes

if (sid === undefined) {
    console.error('Failed to start resource:', startResourceRes)
    return
}

console.log('Start resource successfully, response:', startResourceRes)
```

### 停止云端录制
> 开始录制后，你可以调用 stop 方法离开频道，停止录制。录制停止后如需再次录制，必须再调用 acquire 方法请求一个新的 Resource ID。

需要设置的参数有：
- cname: 频道名
- uid: 用户ID
- resourceId: 云端录制资源ID
- sid: 会话ID
- mode: 云端录制模式
- 更多 clientRequest中的参数见 [Stop](https://doc.shengwang.cn/doc/cloud-recording/restful/cloud-recording/operations/post-v1-apps-appid-cloud_recording-resourceid-resourceid-sid-sid-mode-mode-stop) 接口文档

因为Stop 接口返回的不是一个固定的结构体，所以需要根据返回的serverResponseMode来判断具体的返回类型

通过调用`stop`方法来实现停止云端录制

```typescript
let stopResourceRes: StopResourceRes
try {
    stopResourceRes = await cloudRecordingClient
        .individualScenario()
        .stop(cname, uid, resourceId, sid, true)
} catch (error) {
    console.error('Failed to stop resource:', error)
    return
}

if (stopResourceRes == undefined) {
    console.error('Failed to stop resource')
    return
}

console.log('Stop resource successfully, response:', stopResourceRes)
```

### 查询云端录制状态
> 开始录制后，你可以调用 query 方法查询录制状态。

需要设置的参数有：
- cname: 频道名
- uid: 用户ID
- resourceId: 云端录制资源ID
- sid: 会话ID
- mode: 云端录制模式
- 更多 clientRequest中的参数见[Query](https://doc.shengwang.cn/doc/cloud-recording/restful/cloud-recording/operations/get-v1-apps-appid-cloud_recording-resourceid-resourceid-sid-sid-mode-mode-query)接口文档


通过调用`query`方法来实现查询云端录制状态

```typescript
let queryIndividualRecordingResourceRes: QueryIndividualRecordingResourceRes
try {
    queryIndividualRecordingResourceRes = await cloudRecordingClient
        .individualScenario()
        .query(resourceId, sid)
} catch (error) {
    console.error('Failed to query resource:', error)
    return
}
if (queryIndividualRecordingResourceRes == undefined) {
    console.error('Failed to query resource')
    return
}

console.info(
    'Query resource successfully, response:',
    queryIndividualRecordingResourceRes,
)
```

### 更新云端录制设置
> 开始录制后，你可以调用 update 方法更新如下录制配置：
> * 对单流录制和合流录制，更新订阅名单。
> * 对页面录制，设置暂停/恢复页面录制，或更新页面录制转推到 CDN 的推流地址（URL）。

需要设置的参数有：
- cname: 频道名
- uid: 用户 UID
- resourceId: 云端录制资源ID
- sid: 会话ID
- mode: 云端录制模式
- 更多 clientRequest中的参数见 [Update](https://doc.shengwang.cn/doc/cloud-recording/restful/cloud-recording/operations/post-v1-apps-appid-cloud_recording-resourceid-resourceid-sid-sid-mode-mode-update) 接口文档

通过调用`update`方法来实现更新云端录制设置

```typescript
let updateResourceRes: UpdateResourceRes
try {
    updateResourceRes = await cloudRecordingClient
        .individualScenario()
        .update(cname, uid, resourceId, sid, {
            streamSubscribe: {
                audioUidList: {
                    subscribeAudioUids: ['#allstream#'],
                },
                videoUidList: {
                    subscribeVideoUids: ['#allstream#'],
                },
            },
        })
} catch (error) {
    console.error('Failed to update resource:', error)
    return
}

if (updateResourceRes == undefined) {
    console.error('Failed to update resource')
    return
}

console.log('Update resource successfully, response:', updateResourceRes)
```

## 错误码和响应状态码处理

具体的业务响应码请参考 [业务响应码](https://doc.shengwang.cn/doc/cloud-recording/restful/response-code) 文档
