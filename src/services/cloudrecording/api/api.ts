import { RequestClient } from '../../../agora/client'
import { ERR_NAMESPACE_REC, RecordingErrorTypeEnum, RecordingMode } from '../types'
import { GenericError, retry } from '../../../agora/utils'
import { AgoraCloudRecordingSDKHttpError } from '../error'
import { StartResourceReq } from './req/startResource'
import { AcquireResourceReq } from './req/acquireResource'
import { AcquireResourceRes } from './res/acquireResource'
import {
    MixRecordingHLSAndMP4ServerResponse,
    MixRecordingHLSServerResponse,
    QueryIndividualRecordingServerResponse,
    QueryIndividualVideoScreenshotServerResponse,
    QueryResourceRes,
    ServerResponseType,
    WebRecordingServerResponse,
} from './res/queryResource'
import { StopResourceReq } from './req/stopResource'
import { UpdateResourceRes } from './res/updateResource'
import { StopResourceRes } from './res/stopResource'
import { UpdateResourceReq } from './req/updateResource'
import { UpdateLayoutResourceReq } from './req/updateLayoutResource'
import { UpdateLayoutResourceRes } from './res/updateLayoutResource'
import { AgoraConfig } from '../../../agora/config'
import { StartResourceRes } from './res/startResource'
import { getLogger } from '../../../agora'
import { log } from 'console'

const logger = getLogger('CloudRecordingAPI')

export class CloudRecordingAPI {
    private readonly config: AgoraConfig
    private readonly client: RequestClient

    constructor(config: AgoraConfig) {
        this.config = config
        this.client = new RequestClient(config)
    }

    async acquire(req: AcquireResourceReq, timeout?: number): Promise<AcquireResourceRes> {
        const { body } = (await this.client.post(
            `/v1/apps/${this.config.appId}/cloud_recording/acquire`,
            {
                body: JSON.stringify(req),
                timeout,
            },
        )) as { body: AcquireResourceRes }

        logger.info(body)
        return body
    }

    async start(
        resourceId: string,
        mode: RecordingMode,
        req: StartResourceReq,
        timeout?: number,
    ): Promise<StartResourceRes> {
        let retryCount = 0

        const [err, result] = await retry<{
            response: Response
            body: StartResourceRes
        }>(
            this,
            async () => {
                const { body, response } = (await this.client.post(
                    `/v1/apps/${this.config.appId}/cloud_recording/resourceid/${resourceId}/mode/${mode}/start`,
                    {
                        body: JSON.stringify(req),
                        timeout,
                    },
                )) as { body: StartResourceRes; response: Response }
                const statusCode = response.status
                if (statusCode === 200 || statusCode === 201) {
                    return { response, body }
                }
                // throw http error otherwise
                const error = AgoraCloudRecordingSDKHttpError.error(statusCode)
                if (statusCode >= 400 && statusCode < 410) {
                    // stop retry if statusCode is 40x
                    error.options.immediateStopRetry = true
                    error.body = body
                }
                throw error
            },
            () => retryCount >= 3,
            {
                delay: (retryCount: number) => 1000 * (retryCount + 1),
                onFailAttempt: (err) => {
                    logger.info(`http module error: ${err.message}`)
                    retryCount++
                },
            },
        )

        if (err) {
            throw err
        }

        if (result) {
            return result.body
        }

        throw GenericError.wrapMessage(
            ERR_NAMESPACE_REC,
            RecordingErrorTypeEnum.RecordingNoResultError,
            'UnknownError',
            'Start result empty',
        )
    }

    async query(
        resourceId: string,
        sid: string,
        mode: RecordingMode,
        timeout?: number,
    ): Promise<QueryResourceRes> {
        const { body, response } = (await this.client.get(
            `/v1/apps/${this.config.appId}/cloud_recording/resourceid/${resourceId}/sid/${sid}/mode/${mode}/query`,
            {
                timeout,
            },
        )) as { body: QueryResourceRes; response: Response }

        logger.info(body)
        const statusCode = response.status
        if (statusCode != 200) {
            const error = AgoraCloudRecordingSDKHttpError.error(statusCode)
            error.options.immediateStopRetry = true
            error.body = body
            throw error
        }

        this.setServerResponse(body, mode)

        return body
    }

    setServerResponse(queryResourceRes: QueryResourceRes, mode: RecordingMode): void {
        const fileListMode = queryResourceRes.serverResponse?.fileListMode
        queryResourceRes.serverResponseType = ServerResponseType.QUERY_SERVER_RESPONSE_UNKNOWN_TYPE

        switch (mode) {
            case RecordingMode.Individual:
                if (fileListMode === 'json') {
                    queryResourceRes.serverResponseType =
                        ServerResponseType.QUERY_INDIVIDUAL_RECORDING_SERVER_RESPONSE_TYPE
                    queryResourceRes.queryIndividualRecordingServerResponse =
                        queryResourceRes.serverResponse as QueryIndividualRecordingServerResponse
                } else {
                    queryResourceRes.serverResponseType =
                        ServerResponseType.QUERY_INDIVIDUAL_VIDEO_SCREENSHOT_SERVER_RESPONSE_TYPE
                    queryResourceRes.queryIndividualVideoScreenshotServerResponse =
                        queryResourceRes.serverResponse as QueryIndividualVideoScreenshotServerResponse
                }
                break
            case RecordingMode.Mix:
                if (!fileListMode) {
                    break
                }
                if (fileListMode === 'string') {
                    queryResourceRes.serverResponseType =
                        ServerResponseType.QUERY_MIX_RECORDING_HLS_SERVER_RESPONSE_TYPE
                    queryResourceRes.mixRecordingHLSServerResponse =
                        queryResourceRes.serverResponse as MixRecordingHLSServerResponse
                } else if (fileListMode === 'json') {
                    queryResourceRes.serverResponseType =
                        ServerResponseType.QUERY_MIX_RECORDING_HLS_AND_MP4_SERVER_RESPONSE_TYPE
                    queryResourceRes.mixRecordingHLSAndMP4ServerResponse =
                        queryResourceRes.serverResponse as MixRecordingHLSAndMP4ServerResponse
                } else {
                    throw new Error('unknown fileList mode')
                }
                break
            case RecordingMode.Web:
                queryResourceRes.serverResponseType =
                    ServerResponseType.QUERY_WEB_RECORDING_SERVER_RESPONSE_TYPE
                queryResourceRes.webRecordingServerResponse =
                    queryResourceRes.serverResponse as WebRecordingServerResponse
                break
        }
    }

    async update(
        resourceId: string,
        sid: string,
        mode: RecordingMode,
        req: UpdateResourceReq,
        timeout?: number,
    ): Promise<UpdateResourceRes> {
        const { body, response } = (await this.client.post(
            `/v1/apps/${this.config.appId}/cloud_recording/resourceid/${resourceId}/sid/${sid}/mode/${mode}/update`,
            {
                body: JSON.stringify(req),
                timeout,
            },
        )) as { body: UpdateResourceRes; response: Response }

        logger.info(body)
        const statusCode = response.status
        if (statusCode != 200) {
            const error = AgoraCloudRecordingSDKHttpError.error(statusCode)
            error.options.immediateStopRetry = true
            error.body = body
            throw error
        }

        return body
    }

    async updateLayout(
        resourceId: string,
        sid: string,
        mode: RecordingMode,
        req: UpdateLayoutResourceReq,
        timeout?: number,
    ): Promise<UpdateLayoutResourceRes> {
        const { body, response } = (await this.client.post(
            `/v1/apps/${this.config.appId}/cloud_recording/resourceid/${resourceId}/sid/${sid}/mode/${mode}/updateLayout`,
            {
                body: JSON.stringify(req),
                timeout,
            },
        )) as { body: UpdateLayoutResourceRes; response: Response }

        logger.info(body)

        const statusCode = response.status
        if (statusCode != 200) {
            const error = AgoraCloudRecordingSDKHttpError.error(statusCode)
            error.options.immediateStopRetry = true
            error.body = body
            throw error
        }

        return body
    }

    async stop(
        resourceId: string,
        sid: string,
        mode: RecordingMode,
        req: StopResourceReq,
        timeout?: number,
    ): Promise<StopResourceRes> {
        const { body, response } = (await this.client.post(
            `/v1/apps/${this.config.appId}/cloud_recording/resourceid/${resourceId}/sid/${sid}/mode/${mode}/stop`,
            {
                body: JSON.stringify(req),
                timeout,
            },
        )) as { body: StopResourceRes; response: Response }
        logger.info(body)

        const statusCode = response.status
        if (Math.floor(statusCode / 100) != 2) {
            const error = AgoraCloudRecordingSDKHttpError.error(statusCode)
            error.options.immediateStopRetry = true
            error.body = body
            throw error
        }

        return body
    }
}
