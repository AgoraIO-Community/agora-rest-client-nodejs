import { AgoraConfig } from '../../../agora/config'
import { CloudRecordingAPI } from '../api/api'
import { AcquireResourceReq } from '../api/req/acquireResource'
import { StartResourceReq } from '../api/req/startResource'
import { StopResourceReq } from '../api/req/stopResource'
import { UpdateLayoutResourceReq } from '../api/req/updateLayoutResource'
import { UpdateResourceReq } from '../api/req/updateResource'
import { AcquireResourceRes } from '../api/res/acquireResource'
import { QueryResourceRes } from '../api/res/queryResource'
import { StartResourceRes } from '../api/res/startResource'
import { StopResourceRes } from '../api/res/stopResource'
import { UpdateLayoutResourceRes } from '../api/res/updateLayoutResource'
import { UpdateResourceRes } from '../api/res/updateResource'
import { IndividualScenarioClient } from '../scenario/individual/client'
import { MixScenarioClient } from '../scenario/mix/client'
import { WebScenarioClient } from '../scenario/web/client'
import { RecordingMode } from '../types'

export class CloudRecordingClient {
    private readonly api: CloudRecordingAPI
    private readonly config: AgoraConfig
    private readonly individualScenarioClient: IndividualScenarioClient
    private readonly webScenarioClient: WebScenarioClient
    private readonly mixScenarioClient: MixScenarioClient

    constructor(config: AgoraConfig) {
        this.config = config
        this.api = new CloudRecordingAPI(this.config)
        this.individualScenarioClient = new IndividualScenarioClient(this.api)
        this.webScenarioClient = new WebScenarioClient(this.api)
        this.mixScenarioClient = new MixScenarioClient(this.api)
    }

    async acquire(req: AcquireResourceReq): Promise<AcquireResourceRes> {
        return await this.api.acquire(req)
    }

    async start(
        resourceId: string,
        mode: RecordingMode,
        req: StartResourceReq,
    ): Promise<StartResourceRes> {
        return await this.api.start(resourceId, mode, req)
    }

    async query(resourceId: string, sid: string, mode: RecordingMode): Promise<QueryResourceRes> {
        return await this.api.query(resourceId, sid, mode)
    }

    async update(
        resourceId: string,
        sid: string,
        mode: RecordingMode,
        req: UpdateResourceReq,
    ): Promise<UpdateResourceRes> {
        return await this.api.update(resourceId, sid, mode, req)
    }

    async updateLayout(
        resourceId: string,
        sid: string,
        mode: RecordingMode,
        req: UpdateLayoutResourceReq,
    ): Promise<UpdateLayoutResourceRes> {
        return await this.api.updateLayout(resourceId, sid, mode, req)
    }

    async stop(
        resourceId: string,
        sid: string,
        mode: RecordingMode,
        req: StopResourceReq,
    ): Promise<StopResourceRes> {
        return await this.api.stop(resourceId, sid, mode, req)
    }

    individualScenario(): IndividualScenarioClient {
        return this.individualScenarioClient
    }

    webScenario(): WebScenarioClient {
        return this.webScenarioClient
    }

    mixScenario(): MixScenarioClient {
        return this.mixScenarioClient
    }
}
