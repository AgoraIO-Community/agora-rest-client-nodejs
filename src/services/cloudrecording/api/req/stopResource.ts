export interface StopResourceReq {
    cname: string
    uid: string
    clientRequest: StopClientRequest
}

export interface StopClientRequest {
    async_stop?: boolean
}
