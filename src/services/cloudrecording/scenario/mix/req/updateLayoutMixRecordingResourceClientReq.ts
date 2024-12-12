import {
    LayoutConfig,
    BackgroundConfig,
} from '../../../../../services/cloudrecording/api/req/startResource'

export interface UpdateLayoutMixRecordingResourceClientReq {
    maxResolutionUID?: string
    mixedVideoLayout?: number
    backgroundColor?: string
    backgroundImage?: string
    defaultUserBackgroundImage?: string
    layoutConfig?: LayoutConfig[]
    backgroundConfig?: BackgroundConfig[]
}
