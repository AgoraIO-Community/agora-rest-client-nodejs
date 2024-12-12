import { CloudRecordingAPI } from '../../api/api'
import { AcquireResourceReq } from '../../api/req/acquireResource'
import { AcquireResourceRes } from '../../api/res/acquireResource'
import { StartResourceRes } from '../../api/res/startResource'
import { StopResourceRes } from '../../api/res/stopResource'
import { UpdateResourceRes } from '../../api/res/updateResource'
import { RecordingMode } from '../../types'
import { AcquireMixRecordingResourceClientReq } from './req/acquireMixRecordingResourceClientReq'
import { StartMixRecordingResourceClientReq } from './req/startMixRecordingResourceClientReq'
import { UpdateLayoutMixRecordingResourceClientReq } from './req/updateLayoutMixRecordingResourceClientReq'
import { UpdateMixRecordingResourceClientReq } from './req/updateMixRecordingResourceClientReq'
import { QueryMixHLSAndMP4RecordingResourceRes } from './res/queryMixHLSAndMP4RecordingResourceRes'
import { QueryMixHLSRecordingResourceRes } from './res/queryMixHLSRecordingResourceRes'

export class MixScenarioClient {
    private api: CloudRecordingAPI

    constructor(api: CloudRecordingAPI) {
        this.api = api
    }

    async acquire(
        cname: string,
        uid: string,
        clientRequest: AcquireMixRecordingResourceClientReq,
    ): Promise<AcquireResourceRes> {
        const requestPayload: AcquireResourceReq = {
            cname,
            uid,
            clientRequest: {
                regionAffinity: clientRequest.regionAffinity,
                resourceExpiredHour: clientRequest.resourceExpiredHour,
                excludeResourceIds: clientRequest.excludeResourceIds,
            },
        }

        if (clientRequest.startParameter) {
            requestPayload.clientRequest.startParameter = {
                token: clientRequest.startParameter.token,
                recordingConfig: clientRequest.startParameter.recordingConfig,
                recordingFileConfig: clientRequest.startParameter.recordingFileConfig,
                storageConfig: clientRequest.startParameter.storageConfig,
            }
        }

        return await this.api.acquire(requestPayload)
    }

    async start(
        cname: string,
        uid: string,
        resourceId: string,
        clientRequest: StartMixRecordingResourceClientReq,
    ): Promise<StartResourceRes> {
        return await this.api.start(resourceId, RecordingMode.Mix, {
            uid,
            cname,
            clientRequest: {
                token: clientRequest.token,
                storageConfig: clientRequest.storageConfig,
                recordingFileConfig: clientRequest.recordingFileConfig,
                recordingConfig: clientRequest.recordingConfig,
            },
        })
    }

    async queryHLS(resourceId: string, sid: string): Promise<QueryMixHLSRecordingResourceRes> {
        const res = await this.api.query(resourceId, sid, RecordingMode.Mix)

        return {
            cname: res.cname,
            uid: res.uid,
            sid: res.sid,
            serverResponse: res.mixRecordingHLSServerResponse,
        }
    }

    async queryHLSAndMP4(
        resourceId: string,
        sid: string,
    ): Promise<QueryMixHLSAndMP4RecordingResourceRes> {
        const res = await this.api.query(resourceId, sid, RecordingMode.Mix)

        return {
            cname: res.cname,
            uid: res.uid,
            sid: res.sid,
            serverResponse: res.mixRecordingHLSAndMP4ServerResponse,
        }
    }

    async update(
        cname: string,
        uid: string,
        resourceId: string,
        sid: string,
        clientRequest: UpdateMixRecordingResourceClientReq,
    ): Promise<UpdateResourceRes> {
        return await this.api.update(resourceId, sid, RecordingMode.Mix, {
            cname,
            uid,
            clientRequest: {
                streamSubscribe: clientRequest.streamSubscribe,
            },
        })
    }

    async updateLayout(
        cname: string,
        uid: string,
        resourceId: string,
        sid: string,
        clientRequest: UpdateLayoutMixRecordingResourceClientReq,
    ): Promise<UpdateResourceRes> {
        return await this.api.updateLayout(resourceId, sid, RecordingMode.Mix, {
            cname,
            uid,
            clientRequest: {
                maxResolutionUid: clientRequest.maxResolutionUID,
                mixedVideoLayout: clientRequest.mixedVideoLayout,
                backgroundColor: clientRequest.backgroundColor,
                defaultUserBackgroundImage: clientRequest.defaultUserBackgroundImage,
                layoutConfig: clientRequest.layoutConfig,
                backgroundImage: clientRequest.backgroundImage,
                backgroundConfig: clientRequest.backgroundConfig,
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
        return await this.api.stop(resourceId, sid, RecordingMode.Mix, {
            cname,
            uid,
            clientRequest: {
                async_stop: asyncStop,
            },
        })
    }
}
