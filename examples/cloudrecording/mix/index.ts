import {
    DomainArea,
    Credential,
    StorageConfig,
    AcquireResourceRes,
    QueryMixHLSAndMP4RecordingResourceRes,
    QueryMixHLSRecordingResourceRes,
    StartResourceRes,
    StopResourceRes,
    UpdateLayoutResourceRes,
    UpdateResourceRes,
    RecordingRequestChannelTypeEnum,
} from '../../../src'
import { BaseScenario } from '../base'

export class MixRecordingService extends BaseScenario {
    constructor(
        domainArea: DomainArea,
        appId: string,
        cname: string,
        uid: string,
        credential: Credential,
    ) {
        super(domainArea, appId, cname, uid, credential)
    }

    async runHLS(token: string, storageConfig: StorageConfig): Promise<void> {
        // Acquire resource
        let acquireResourceRes: AcquireResourceRes
        try {
            acquireResourceRes = await this.cloudRecordingClient
                .mixScenario()
                .acquire(this.cname, this.uid, {
                    resourceExpiredHour: 1,
                })
        } catch (error) {
            console.error('Failed to acquire resource:', error)
            return
        }

        const { resourceId } = acquireResourceRes

        if (resourceId === undefined) {
            console.error('Failed to acquire resource:', acquireResourceRes)
            return
        }

        console.log('Acquire resource successfully, response:', acquireResourceRes)

        // Start resource
        let startResourceRes: StartResourceRes
        try {
            startResourceRes = await this.cloudRecordingClient
                .mixScenario()
                .start(this.cname, this.uid, resourceId, {
                    token,
                    recordingConfig: {
                        channelType: RecordingRequestChannelTypeEnum.Live,
                        streamTypes: 2,
                        maxIdleTime: 30,
                        audioProfile: 2,
                        transcodingConfig: {
                            width: 640,
                            height: 480,
                            fps: 15,
                            bitrate: 800,
                            mixedVideoLayout: 0,
                            backgroundColor: '#000000',
                        },
                        subscribeAudioUids: ['#allstream#'],
                        subscribeVideoUids: ['#allstream#'],
                    },
                    recordingFileConfig: {
                        avFileType: ['hls'],
                    },
                    storageConfig,
                })
        } catch (error) {
            console.error('Failed to start resource:', error)
            return
        }

        const { sid } = startResourceRes

        if (sid === undefined) {
            console.error('Failed to start resource:', startResourceRes)
            return
        }

        console.log('Start resource successfully, response:', startResourceRes)

        // Query resource
        for (let i = 0; i < 3; i++) {
            let queryMixHLSRecordingResourceRes: QueryMixHLSRecordingResourceRes
            try {
                queryMixHLSRecordingResourceRes = await this.cloudRecordingClient
                    .mixScenario()
                    .queryHLS(resourceId, sid)
            } catch (error) {
                console.error('Failed to query resource:', error)
                return
            }
            if (queryMixHLSRecordingResourceRes == undefined) {
                console.error('Failed to query resource')
                return
            }

            console.info('Query resource successfully, response:', queryMixHLSRecordingResourceRes)

            await new Promise((resolve) => setTimeout(resolve, 3000))
        }

        // Update resource
        let updateResourceRes: UpdateResourceRes
        try {
            updateResourceRes = await this.cloudRecordingClient
                .mixScenario()
                .update(this.cname, this.uid, resourceId, sid, {
                    streamSubscribe: {
                        audioUidList: {
                            subscribeAudioUids: ['#allstream#'],
                        },
                        videoUidList: {
                            subscribeVideoUids: ['#allstream#'],
                        },
                    },
                })
        } catch (error) {
            console.error('Failed to update resource:', error)
            return
        }

        if (updateResourceRes == undefined) {
            console.error('Failed to update resource')
            return
        }

        console.log('Update resource successfully, response:', updateResourceRes)

        // UpdateLayout resource
        let updateLayoutResourceRes: UpdateLayoutResourceRes
        try {
            updateLayoutResourceRes = await this.cloudRecordingClient
                .mixScenario()
                .updateLayout(this.cname, this.uid, resourceId, sid, {
                    mixedVideoLayout: 1,
                    backgroundColor: '#FF0000',
                })
        } catch (error) {
            console.error('Failed to update resource:', error)
            return
        }

        if (updateLayoutResourceRes == undefined) {
            console.error('Failed to update resource')
            return
        }

        console.log('Update resource successfully, response:', updateResourceRes)

        // Query resource
        for (let i = 0; i < 3; i++) {
            let queryMixHLSRecordingResourceRes: QueryMixHLSRecordingResourceRes
            try {
                queryMixHLSRecordingResourceRes = await this.cloudRecordingClient
                    .mixScenario()
                    .queryHLS(resourceId, sid)
            } catch (error) {
                console.error('Failed to query resource:', error)
                return
            }
            if (queryMixHLSRecordingResourceRes == undefined) {
                console.error('Failed to query resource')
                return
            }

            console.info('Query resource successfully, response:', queryMixHLSRecordingResourceRes)

            await new Promise((resolve) => setTimeout(resolve, 3000))
        }

        // Stop resource
        let stopResourceRes: StopResourceRes
        try {
            stopResourceRes = await this.cloudRecordingClient
                .mixScenario()
                .stop(this.cname, this.uid, resourceId, sid, true)
        } catch (error) {
            console.error('Failed to stop resource:', error)
            return
        }

        if (stopResourceRes == undefined) {
            console.error('Failed to stop resource')
            return
        }

        console.log('Stop resource successfully, response:', stopResourceRes)
    }

    async runHLSAndMP4(token: string, storageConfig: StorageConfig): Promise<void> {
        // Acquire resource
        let acquireResourceRes: AcquireResourceRes
        try {
            acquireResourceRes = await this.cloudRecordingClient
                .mixScenario()
                .acquire(this.cname, this.uid, {
                    resourceExpiredHour: 1,
                })
        } catch (error) {
            console.error('Failed to acquire resource:', error)
            return
        }

        const { resourceId } = acquireResourceRes

        if (resourceId === undefined) {
            console.error('Failed to acquire resource:', acquireResourceRes)
            return
        }

        console.log('Acquire resource successfully, response:', acquireResourceRes)

        // Start resource
        let startResourceRes: StartResourceRes
        try {
            startResourceRes = await this.cloudRecordingClient
                .mixScenario()
                .start(this.cname, this.uid, resourceId, {
                    token,
                    recordingConfig: {
                        channelType: RecordingRequestChannelTypeEnum.Live,
                        streamTypes: 2,
                        maxIdleTime: 30,
                        audioProfile: 2,
                        transcodingConfig: {
                            width: 640,
                            height: 480,
                            fps: 15,
                            bitrate: 800,
                            mixedVideoLayout: 0,
                            backgroundColor: '#000000',
                        },
                        subscribeAudioUids: ['#allstream#'],
                        subscribeVideoUids: ['#allstream#'],
                    },
                    recordingFileConfig: {
                        avFileType: ['hls', 'mp4'],
                    },
                    storageConfig,
                })
        } catch (error) {
            console.error('Failed to start resource:', error)
            return
        }

        const { sid } = startResourceRes

        if (sid === undefined) {
            console.error('Failed to start resource:', startResourceRes)
            return
        }

        console.log('Start resource successfully, response:', startResourceRes)

        // Query resource
        for (let i = 0; i < 3; i++) {
            let queryMixHLSAndMP4RecordingResourceRes: QueryMixHLSAndMP4RecordingResourceRes
            try {
                queryMixHLSAndMP4RecordingResourceRes = await this.cloudRecordingClient
                    .mixScenario()
                    .queryHLSAndMP4(resourceId, sid)
            } catch (error) {
                console.error('Failed to query resource:', error)
                return
            }
            if (queryMixHLSAndMP4RecordingResourceRes == undefined) {
                console.error('Failed to query resource')
                return
            }

            console.info(
                'Query resource successfully, response:',
                queryMixHLSAndMP4RecordingResourceRes,
            )

            await new Promise((resolve) => setTimeout(resolve, 3000))
        }

        // Update resource
        let updateResourceRes: UpdateResourceRes
        try {
            updateResourceRes = await this.cloudRecordingClient
                .mixScenario()
                .update(this.cname, this.uid, resourceId, sid, {
                    streamSubscribe: {
                        audioUidList: {
                            subscribeAudioUids: ['#allstream#'],
                        },
                        videoUidList: {
                            subscribeVideoUids: ['#allstream#'],
                        },
                    },
                })
        } catch (error) {
            console.error('Failed to update resource:', error)
            return
        }

        if (updateResourceRes == undefined) {
            console.error('Failed to update resource')
            return
        }

        console.log('Update resource successfully, response:', updateResourceRes)

        // UpdateLayout resource
        let updateLayoutResourceRes: UpdateLayoutResourceRes
        try {
            updateLayoutResourceRes = await this.cloudRecordingClient
                .mixScenario()
                .updateLayout(this.cname, this.uid, resourceId, sid, {
                    mixedVideoLayout: 1,
                    backgroundColor: '#FF0000',
                })
        } catch (error) {
            console.error('Failed to update resource:', error)
            return
        }

        if (updateLayoutResourceRes == undefined) {
            console.error('Failed to update resource')
            return
        }

        console.log('Update resource successfully, response:', updateResourceRes)

        // Query resource
        for (let i = 0; i < 3; i++) {
            let queryMixHLSAndMP4RecordingResourceRes: QueryMixHLSAndMP4RecordingResourceRes
            try {
                queryMixHLSAndMP4RecordingResourceRes = await this.cloudRecordingClient
                    .mixScenario()
                    .queryHLSAndMP4(resourceId, sid)
            } catch (error) {
                console.error('Failed to query resource:', error)
                return
            }
            if (queryMixHLSAndMP4RecordingResourceRes == undefined) {
                console.error('Failed to query resource')
                return
            }

            console.info(
                'Query resource successfully, response:',
                queryMixHLSAndMP4RecordingResourceRes,
            )

            await new Promise((resolve) => setTimeout(resolve, 3000))
        }

        // Stop resource
        let stopResourceRes: StopResourceRes
        try {
            stopResourceRes = await this.cloudRecordingClient
                .mixScenario()
                .stop(this.cname, this.uid, resourceId, sid, true)
        } catch (error) {
            console.error('Failed to stop resource:', error)
            return
        }

        if (stopResourceRes == undefined) {
            console.error('Failed to stop resource')
            return
        }

        console.log('Stop resource successfully, response:', stopResourceRes)
    }
}
