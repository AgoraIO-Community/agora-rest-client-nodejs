import {
    ResquestMethod,
    RequestOptions,
    RequestClientResponse,
    ERR_NAMESPACE_CLIENT,
    ErrorTypeEnum,
} from '../types'
import { DEFAULT_REQ_TIMEOUT, ERR_NAMESPACE_LIB, GenericError, getUserAgent, retry } from '../utils'
import { DomainPool } from '../domain/domain'
import * as https from 'https'
import { URL } from 'url'
import fetch, { Headers, RequestInit, Response } from 'node-fetch'
import querystring from 'querystring'
import { bestDomain } from '../domain/resolver'
import { AgoraConfig } from '../config'
import { getLogger } from '../log'
import { log } from 'console'

const logger = getLogger('RequestClient')

export class RequestClient {
    private config: AgoraConfig
    private keepAliveAgent: https.Agent
    domainPool: DomainPool
    timeout: number

    constructor(config: AgoraConfig) {
        this.config = config
        this.domainPool = new DomainPool(config.domainArea)
        this.timeout = config.httpTimeout || DEFAULT_REQ_TIMEOUT
        this.keepAliveAgent = new https.Agent({
            keepAlive: true,
            keepAliveMsecs: 3000,
        })
    }

    buildHeaders(host: string, userAgent: string): Record<string, string> {
        const now = new Date()
        return {
            accept: 'application/json',
            date: now.toUTCString(),
            host,
            'content-type': 'application/json',
            'user-agent': userAgent,
        }
    }

    async request(
        method: ResquestMethod,
        uriPattern: string,
        options: RequestOptions,
    ): Promise<RequestClientResponse> {
        let err: GenericError | undefined, response: Response | undefined
        const abortController = new AbortController()
        const timeout = options.timeout === undefined ? this.timeout : options.timeout
        let aborted = false

        const timer = setTimeout(() => {
            clearTimeout(timer)
            aborted = true
            abortController.abort()
        }, timeout)
        if (this.domainPool.domainNeedUpdate()) {
            try {
                const domain = await bestDomain(
                    this.domainPool.allDomains,
                    this.domainPool.currentRegion,
                )
                this.domainPool.selectDomain(domain)
            } catch (e) {
                err = GenericError.wrapError(
                    ERR_NAMESPACE_LIB,
                    ErrorTypeEnum.RequestDNSError,
                    e as Error,
                )
                throw err
            }
        }

        // start request, but don't process response yet
        ;[err, response] = await retry<Response>(
            this,
            async (retryCount) => {
                logger.debug(`http module retry attempt ${retryCount}...`)
                const endpoint = this.domainPool.currentUrl
                logger.debug(`current endpoint: ${endpoint}`)
                const parsedURL = new URL(endpoint)
                const host = parsedURL.hostname
                const userAgent = getUserAgent()
                logger.debug(`current host: ${host},userAgent: ${userAgent}`)

                const mixHeaders: Record<string, string> = Object.assign(
                    this.buildHeaders(host || '', userAgent),
                )

                this.config.credential?.setAuth(mixHeaders)

                const fetchOptions: RequestInit = {
                    method,
                    agent: this.keepAliveAgent,
                    headers: new Headers(mixHeaders),
                    body: options.body,
                    signal: abortController.signal,
                }

                let url = `${endpoint}${uriPattern}`
                if (options.query && Object.keys(options.query).length > 0) {
                    url += `?${querystring.stringify(options.query)}`
                }
                logger.debug(`request body: ${options.body}`)
                const response = await fetch(url, fetchOptions)
                logger.debug(
                    `status:${response.status},method:${fetchOptions.method},url:${url} requestId: ${response.headers.get('x-request-id')}`,
                )
                return response
            },
            () => aborted,
            {
                onFailAttempt: (err) => {
                    logger.warn(`http module error: ${err.message}`)
                    this.domainPool.nextRegion()
                },
                // delay for 500ms before next request
                delay: (retryCount: number) => (retryCount >= 1 ? 500 : 0),
            },
        )

        this._checkRequestAborted(aborted, timer)

        if (err) {
            throw err
        }

        if (response) {
            let body
            try {
                body = await response.json()
            } catch (e) {
                clearTimeout(timer)
                throw GenericError.wrapError(
                    ERR_NAMESPACE_LIB,
                    ErrorTypeEnum.RequestResponseError,
                    e as Error,
                )
            }

            clearTimeout(timer)
            // @ts-ignore
            return { body, response }
        } else {
            clearTimeout(timer)
            throw GenericError.wrapMessage(
                ERR_NAMESPACE_LIB,
                ErrorTypeEnum.RequestResponseError,
                'FormatError',
                'unknown response',
            )
        }
    }

    async put(path: string, options: RequestOptions): Promise<RequestClientResponse> {
        return this.request('PUT', path, options)
    }

    async post(path: string, options: RequestOptions): Promise<RequestClientResponse> {
        return this.request('POST', path, options)
    }

    async get(path: string, options: RequestOptions): Promise<RequestClientResponse> {
        return this.request('GET', path, options)
    }

    async delete(path: string, options: RequestOptions): Promise<RequestClientResponse> {
        return this.request('DELETE', path, options)
    }

    // ------------------- private methods -------------------
    private _checkRequestAborted(aborted: boolean, timer: NodeJS.Timeout) {
        if (aborted) {
            logger.error(`request aborted`)
            clearTimeout(timer)
            throw GenericError.wrapMessage(
                ERR_NAMESPACE_CLIENT,
                ErrorTypeEnum.RequestTimeoutError,
                'TimeoutError',
                'request timeout',
            )
        }
    }
}
