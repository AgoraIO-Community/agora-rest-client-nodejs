import { CloudRecordingAPI } from '../../api/api'
import { AcquireResourceRes } from '../../api/res/acquireResource'
import { StartResourceRes } from '../../api/res/startResource'
import { StopResourceRes } from '../../api/res/stopResource'
import { RecordingMode } from '../../types'
import { AcquireIndividualResourceClientReq } from './req/acquireIndividualResourceClientReq'
import { StartIndividualRecordingClientReq } from './req/startIndividualResourceClientReq'
import { UpdateResourceRes } from '../../api/res/updateResource'
import { UpdateIndividualRecordingResourceClientReq } from './req/updateIndividualResourceClientReq'
import { QueryIndividualRecordingResourceRes } from './res/queryIndividualRecordingResourceRes'
import { QueryIndividualRecordingVideoScreenshotResourceRes } from './res/queryIndividualRecordingVideoScreenshotResourceRes'
import { AcquireResourceReq } from '../../api/req/acquireResource'

export class IndividualScenarioClient {
    private api: CloudRecordingAPI

    constructor(api: CloudRecordingAPI) {
        this.api = api
    }

    async acquire(
        cname: string,
        uid: string,
        clientRequest: AcquireIndividualResourceClientReq,
    ): Promise<AcquireResourceRes> {
        const requestPayload: AcquireResourceReq = {
            cname,
            uid,
            clientRequest: {
                scene: 0,
                resourceExpiredHour: clientRequest.resourceExpiredHour,
                excludeResourceIds: clientRequest.excludeResourceIds,
                regionAffinity: clientRequest.regionAffinity,
            },
        }

        if (clientRequest.startParameter) {
            requestPayload.clientRequest.startParameter = {
                token: clientRequest.startParameter.token,
                recordingConfig: clientRequest.startParameter.recordingConfig,
                recordingFileConfig: clientRequest.startParameter.recordingFileConfig,
                snapshotConfig: clientRequest.startParameter.snapshotConfig,
                storageConfig: clientRequest.startParameter.storageConfig,
            }
        }

        return await this.api.acquire(requestPayload)
    }

    async query(resourceId: string, sid: string): Promise<QueryIndividualRecordingResourceRes> {
        const res = await this.api.query(resourceId, sid, RecordingMode.Individual)

        return {
            cname: res.cname,
            uid: res.uid,
            sid: res.sid,
            serverResponse: res.queryIndividualRecordingServerResponse,
        }
    }

    async queryVideoScreenshot(
        resourceId: string,
        sid: string,
    ): Promise<QueryIndividualRecordingVideoScreenshotResourceRes> {
        const res = await this.api.query(resourceId, sid, RecordingMode.Individual)

        return {
            cname: res.cname,
            uid: res.uid,
            sid: res.sid,
            serverResponse: res.queryIndividualVideoScreenshotServerResponse,
        }
    }

    async start(
        cname: string,
        uid: string,
        resourceId: string,
        clientRequest: StartIndividualRecordingClientReq,
    ): Promise<StartResourceRes> {
        return await this.api.start(resourceId, RecordingMode.Individual, {
            uid,
            cname,
            clientRequest: {
                token: clientRequest.token,
                recordingConfig: clientRequest.recordingConfig,
                recordingFileConfig: clientRequest.recordingFileConfig,
                snapshotConfig: clientRequest.snapshotConfig,
                storageConfig: clientRequest.storageConfig,
            },
        })
    }

    async update(
        cname: string,
        uid: string,
        resourceId: string,
        sid: string,
        clientRequest: UpdateIndividualRecordingResourceClientReq,
    ): Promise<UpdateResourceRes> {
        return await this.api.update(resourceId, sid, RecordingMode.Individual, {
            cname,
            uid,
            clientRequest: {
                streamSubscribe: clientRequest.streamSubscribe,
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
        return await this.api.stop(resourceId, sid, RecordingMode.Individual, {
            cname,
            uid,
            clientRequest: {
                async_stop: asyncStop,
            },
        })
    }
}
