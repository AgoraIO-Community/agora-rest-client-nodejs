import { CloudRecordingAPI } from '../../api/api'
import { AcquireResourceReq } from '../../api/req/acquireResource'
import { AcquireResourceRes } from '../../api/res/acquireResource'
import { StartResourceRes } from '../../api/res/startResource'
import { StopResourceRes } from '../../api/res/stopResource'
import { UpdateResourceRes } from '../../api/res/updateResource'
import { RecordingMode } from '../../types'
import { AcquireWebRecordingResourceClientReq } from './req/acquireWebRecordingResourceClientReq'
import { StartWebRecordingResourceClientReq } from './req/startWebRecordingResourceClientReq'
import { UpdateWebRecordingResourceClientReq } from './req/updateWebRecordingResourceClientReq'
import { QueryWebRecordingResourceRes } from './res/queryWebRecordingResourceRes'

export class WebScenarioClient {
    private api: CloudRecordingAPI

    constructor(api: CloudRecordingAPI) {
        this.api = api
    }

    async acquire(
        cname: string,
        uid: string,
        clientRequest: AcquireWebRecordingResourceClientReq,
    ): Promise<AcquireResourceRes> {
        const requestPayload: AcquireResourceReq = {
            cname,
            uid,
            clientRequest: {
                scene: 1,
                resourceExpiredHour: clientRequest.resourceExpiredHour,
                regionAffinity: clientRequest.regionAffinity,
                excludeResourceIds: clientRequest.excludeResourceIds,
            },
        }

        if (clientRequest.startParameter) {
            requestPayload.clientRequest.startParameter = {
                storageConfig: clientRequest.startParameter.storageConfig,
                recordingFileConfig: clientRequest.startParameter.recordingFileConfig,
                extensionServiceConfig: clientRequest.startParameter.extensionServiceConfig,
            }
        }

        return await this.api.acquire(requestPayload)
    }

    async start(
        cname: string,
        uid: string,
        resourceId: string,
        clientRequest: StartWebRecordingResourceClientReq,
    ): Promise<StartResourceRes> {
        return await this.api.start(resourceId, RecordingMode.Web, {
            uid,
            cname,
            clientRequest: {
                storageConfig: clientRequest.storageConfig,
                recordingFileConfig: clientRequest.recordingFileConfig,
                extensionServiceConfig: clientRequest.extensionServiceConfig,
            },
        })
    }

    async query(resourceId: string, sid: string): Promise<QueryWebRecordingResourceRes> {
        const res = await this.api.query(resourceId, sid, RecordingMode.Web)

        return {
            cname: res.cname,
            uid: res.uid,
            sid: res.sid,
            serverResponse: res.webRecordingServerResponse,
        }
    }

    async update(
        cname: string,
        uid: string,
        resourceId: string,
        sid: string,
        clientRequest: UpdateWebRecordingResourceClientReq,
    ): Promise<UpdateResourceRes> {
        return await this.api.update(resourceId, sid, RecordingMode.Web, {
            cname,
            uid,
            clientRequest: {
                webRecordingConfig: clientRequest.webRecordingConfig,
                rtmpPublishConfig: clientRequest.rtmpPublishConfig,
            },
        })
    }

    async stop(
        cname: string,
        uid: string,
        resourceId: string,
        sid: string,
        asyncStop: boolean,
    ): Promise<StopResourceRes> {
        return await this.api.stop(
            resourceId,
            sid,
            RecordingMode.Web,
            {
                cname,
                uid,
                clientRequest: {
                    async_stop: asyncStop,
                },
            },
            10000,
        )
    }
}
