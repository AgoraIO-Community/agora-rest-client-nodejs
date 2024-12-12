import { CloudRecordingClient, DomainArea, Credential } from '../../../src'

export class BaseScenario {
    protected readonly domainArea: DomainArea
    protected readonly appId: string
    protected readonly cname: string
    protected readonly uid: string
    protected readonly credential: Credential
    protected readonly cloudRecordingClient: CloudRecordingClient

    constructor(
        domainArea: DomainArea,
        appId: string,
        cname: string,
        uid: string,
        credential: Credential,
    ) {
        this.domainArea = domainArea
        this.appId = appId
        this.cname = cname
        this.uid = uid
        this.credential = credential
        this.cloudRecordingClient = new CloudRecordingClient({
            appId: this.appId,
            credential: this.credential,
            domainArea: this.domainArea,
            httpTimeout: 10000,
        })
    }
}
