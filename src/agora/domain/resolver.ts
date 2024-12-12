import { Resolver } from 'dns/promises'
import { getLogger } from '../log'
import { ERR_NAMESPACE_LIB, GenericError } from '../utils'
import { ErrorTypeEnum } from '../types'

const logger = getLogger('RequestClient')

export function bestDomain(domains: string[], regionPrefix: string): Promise<string> {
    return new Promise((resolve, reject) => {
        let failCounter = 0
        let domain: string
        const resolver = new Resolver({ timeout: 2000 })
        for (let i = 0; i < domains.length; i++) {
            const promise = resolver.resolve4(`${regionPrefix}.${domains[i]}`)
            promise
                .then((result) => {
                    if (!domain) {
                        domain = domains[i]
                        resolve(domain)
                    }
                })
                .catch((e) => {
                    logger.error(`resolve "${domains[i]}" failed: ${e.code}`)
                    failCounter++
                })
                .finally(() => {
                    if (failCounter === domains.length) {
                        reject(
                            GenericError.wrapMessage(
                                ERR_NAMESPACE_LIB,
                                ErrorTypeEnum.RequestDNSError,
                                'DnsError',
                                'all dns failed',
                            ),
                        )
                    }
                })
        }
    })
}
