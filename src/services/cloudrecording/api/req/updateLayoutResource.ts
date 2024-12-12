import { BackgroundConfig, LayoutConfig } from './startResource'

export interface UpdateLayoutResourceReq {
    cname?: string
    uid?: string
    clientRequest?: UpdateLayoutClientRequest
}

export interface UpdateLayoutClientRequest {
    maxResolutionUid?: string
    mixedVideoLayout?: number
    backgroundColor?: string
    backgroundImage?: string
    defaultUserBackgroundImage?: string
    layoutConfig?: LayoutConfig[]
    backgroundConfig?: BackgroundConfig[]
}
