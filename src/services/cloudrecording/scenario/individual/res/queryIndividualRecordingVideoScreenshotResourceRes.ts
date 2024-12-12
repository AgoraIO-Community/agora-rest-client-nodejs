import { QueryIndividualVideoScreenshotServerResponse } from '../../../../../services/cloudrecording/api/res/queryResource'

export interface QueryIndividualRecordingVideoScreenshotResourceRes {
    cname?: string
    uid?: string
    resourceId?: string
    sid?: string
    serverResponse?: QueryIndividualVideoScreenshotServerResponse
}
