import { DomainArea } from '../types'
import { getLogger } from '../log'

const logger = getLogger('pool')

export class DomainPool {
    private domainArea: DomainArea
    private domainSuffixList: string[] = []
    private currentDomain: string
    private regionPrefixList: string[] = []
    private currentRegionPrefixList: string[] = []
    private domainUpdateTs: number = -1

    constructor(area: DomainArea) {
        this.domainArea = area
        switch (this.domainArea) {
            case DomainArea.US:
                this.domainSuffixList = ['agora.io', 'sd-rtn.com']
                this.regionPrefixList = ['api-us-west-1', 'api-us-east-1']
                break
            case DomainArea.EU:
                this.domainSuffixList = ['agora.io', 'sd-rtn.com']
                this.regionPrefixList = ['api-eu-west-1', 'api-eu-central-1']
                break
            case DomainArea.AP:
                this.domainSuffixList = ['agora.io', 'sd-rtn.com']
                this.regionPrefixList = ['api-ap-southeast-1', 'api-ap-northeast-1']
                break
            case DomainArea.CN:
                this.domainSuffixList = ['sd-rtn.com', 'agora.io']
                this.regionPrefixList = ['api-cn-north-1', 'api-cn-east-2']
                break
            default:
                break
        }
        this.currentRegionPrefixList = [...this.regionPrefixList]
        this.currentDomain = this.domainSuffixList[0]
    }

    get currentRegion(): string {
        return this.currentRegionPrefixList[0]
    }

    get currentUrl(): string {
        return `https://${this.currentRegion}.${this.currentDomain}`
    }

    get allDomains(): string[] {
        return [...this.domainSuffixList]
    }

    nextRegion(): void {
        this.currentRegionPrefixList.shift()
        if (this.currentRegionPrefixList.length === 0) {
            this.currentRegionPrefixList = [...this.regionPrefixList]
        }
    }

    domainNeedUpdate(): boolean {
        // cache last domain result for 30 secs
        return Date.now() - this.domainUpdateTs > 30 * 1000
    }

    selectDomain(domain: string) {
        if (this.domainSuffixList.includes(domain)) {
            this.currentDomain = domain
            this.domainUpdateTs = Date.now()
            logger.info(`domain updated to ${domain}`)
        }
    }
}
