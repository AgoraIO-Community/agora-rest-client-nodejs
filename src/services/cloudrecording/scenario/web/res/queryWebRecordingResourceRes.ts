import { WebRecordingServerResponse } from '../../../../../services/cloudrecording/api/res/queryResource'

export interface QueryWebRecordingResourceRes {
    cname?: string
    uid?: string
    resourceId?: string
    sid?: string
    serverResponse?: WebRecordingServerResponse
}
