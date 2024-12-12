export type ResquestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

export enum DomainArea {
    US = 0,
    EU = 1,
    AP = 2,
    CN = 3,
}

export interface RequestOptions {
    timeout?: number
    body?: string
    query?: Record<string, string>
    headers?: Record<string, string>
}

export enum ErrorTypeEnum {
    UnknownError = -1,
    RequestDNSError = 0,
    RequestTimeoutError = 1,
    RequestResponseError = 2,
}

export interface RequestClientResponse {
    body?: unknown
    response: Response
}

export const ERR_NAMESPACE_CLIENT = 'client'
