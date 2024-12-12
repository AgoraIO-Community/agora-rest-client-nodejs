import {
    WebRecordingConfig,
    RtmpPublishConfig,
} from '../../../../../services/cloudrecording/api/req/updateResource'

export interface UpdateWebRecordingResourceClientReq {
    webRecordingConfig?: WebRecordingConfig
    rtmpPublishConfig?: RtmpPublishConfig
}
