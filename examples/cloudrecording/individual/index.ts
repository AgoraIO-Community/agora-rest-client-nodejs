import {
    DomainArea,
    Credential,
    StorageConfig,
    AcquireResourceRes,
    StartResourceRes,
    QueryIndividualRecordingResourceRes,
    UpdateResourceRes,
    StopResourceRes,
    QueryIndividualRecordingVideoScreenshotResourceRes,
    RecordingRequestChannelTypeEnum,
} from '../../../src'
import { BaseScenario } from '../base'

export class IndividualRecordingService extends BaseScenario {
    constructor(
        domainArea: DomainArea,
        appId: string,
        cname: string,
        uid: string,
        credential: Credential,
    ) {
        super(domainArea, appId, cname, uid, credential)
    }

    async runRecording(token: string, storageConfig: StorageConfig): Promise<void> {
        // Acquire resource
        let acquireResourceRes: AcquireResourceRes
        try {
            acquireResourceRes = await this.cloudRecordingClient
                .individualScenario()
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
                .individualScenario()
                .start(this.cname, this.uid, resourceId, {
                    token,
                    recordingConfig: {
                        channelType: RecordingRequestChannelTypeEnum.Live,
                        streamTypes: 2,
                        maxIdleTime: 30,
                        subscribeAudioUids: ['#allstream#'],
                        subscribeVideoUids: ['#allstream#'],
                        subscribeUidGroup: 0,
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
            let queryIndividualRecordingResourceRes: QueryIndividualRecordingResourceRes
            try {
                queryIndividualRecordingResourceRes = await this.cloudRecordingClient
                    .individualScenario()
                    .query(resourceId, sid)
            } catch (error) {
                console.error('Failed to query resource:', error)
                return
            }
            if (queryIndividualRecordingResourceRes == undefined) {
                console.error('Failed to query resource')
                return
            }

            console.info(
                'Query resource successfully, response:',
                queryIndividualRecordingResourceRes,
            )

            await new Promise((resolve) => setTimeout(resolve, 3000))
        }

        // Update resource
        let updateResourceRes: UpdateResourceRes
        try {
            updateResourceRes = await this.cloudRecordingClient
                .individualScenario()
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

        // Query resource
        for (let i = 0; i < 3; i++) {
            let queryIndividualRecordingResourceRes: QueryIndividualRecordingResourceRes
            try {
                queryIndividualRecordingResourceRes = await this.cloudRecordingClient
                    .individualScenario()
                    .query(resourceId, sid)
            } catch (error) {
                console.error('Failed to query resource:', error)
                return
            }
            if (queryIndividualRecordingResourceRes == undefined) {
                console.error('Failed to query resource')
                return
            }

            console.info(
                'Query resource successfully, response:',
                queryIndividualRecordingResourceRes,
            )

            await new Promise((resolve) => setTimeout(resolve, 3000))
        }

        // Stop resource
        let stopResourceRes: StopResourceRes
        try {
            stopResourceRes = await this.cloudRecordingClient
                .individualScenario()
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

    async runSnapshot(token: string, storageConfig: StorageConfig): Promise<void> {
        // Acquire resource
        let acquireResourceRes: AcquireResourceRes
        try {
            acquireResourceRes = await this.cloudRecordingClient
                .individualScenario()
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
                .individualScenario()
                .start(this.cname, this.uid, resourceId, {
                    token,
                    recordingConfig: {
                        channelType: RecordingRequestChannelTypeEnum.Live,
                        streamTypes: 2,
                        maxIdleTime: 30,
                        subscribeAudioUids: ['#allstream#'],
                        subscribeVideoUids: ['#allstream#'],
                        subscribeUidGroup: 0,
                    },
                    snapshotConfig: {
                        captureInterval: 5,
                        fileType: ['jpg'],
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
            let queryIndividualRecordingVideoScreenshotResourceRes: QueryIndividualRecordingVideoScreenshotResourceRes
            try {
                queryIndividualRecordingVideoScreenshotResourceRes = await this.cloudRecordingClient
                    .individualScenario()
                    .queryVideoScreenshot(resourceId, sid)
            } catch (error) {
                console.error('Failed to query resource:', error)
                return
            }
            if (queryIndividualRecordingVideoScreenshotResourceRes == undefined) {
                console.error('Failed to query resource')
                return
            }

            console.info(
                'Query resource successfully, response:',
                queryIndividualRecordingVideoScreenshotResourceRes,
            )

            await new Promise((resolve) => setTimeout(resolve, 3000))
        }

        // Update resource
        let updateResourceRes: UpdateResourceRes
        try {
            updateResourceRes = await this.cloudRecordingClient
                .individualScenario()
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

        // Query resource
        for (let i = 0; i < 3; i++) {
            let queryIndividualRecordingVideoScreenshotResourceRes: QueryIndividualRecordingVideoScreenshotResourceRes
            try {
                queryIndividualRecordingVideoScreenshotResourceRes = await this.cloudRecordingClient
                    .individualScenario()
                    .queryVideoScreenshot(resourceId, sid)
            } catch (error) {
                console.error('Failed to query resource:', error)
                return
            }
            if (queryIndividualRecordingVideoScreenshotResourceRes == undefined) {
                console.error('Failed to query resource')
                return
            }

            console.info(
                'Query resource successfully, response:',
                queryIndividualRecordingVideoScreenshotResourceRes,
            )

            await new Promise((resolve) => setTimeout(resolve, 3000))
        }

        // Stop resource
        let stopResourceRes: StopResourceRes
        try {
            stopResourceRes = await this.cloudRecordingClient
                .individualScenario()
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

    async runRecordingAndSnapshot(token: string, storageConfig: StorageConfig): Promise<void> {
        // Acquire resource
        let acquireResourceRes: AcquireResourceRes
        try {
            acquireResourceRes = await this.cloudRecordingClient
                .individualScenario()
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
                .individualScenario()
                .start(this.cname, this.uid, resourceId, {
                    token,
                    recordingConfig: {
                        channelType: RecordingRequestChannelTypeEnum.Live,
                        streamTypes: 2,
                        maxIdleTime: 30,
                        subscribeAudioUids: ['#allstream#'],
                        subscribeVideoUids: ['#allstream#'],
                        subscribeUidGroup: 0,
                    },
                    snapshotConfig: {
                        captureInterval: 5,
                        fileType: ['jpg'],
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
            let queryIndividualRecordingResourceRes: QueryIndividualRecordingResourceRes
            try {
                queryIndividualRecordingResourceRes = await this.cloudRecordingClient
                    .individualScenario()
                    .query(resourceId, sid)
            } catch (error) {
                console.error('Failed to query resource:', error)
                return
            }
            if (queryIndividualRecordingResourceRes == undefined) {
                console.error('Failed to query resource')
                return
            }

            console.info(
                'Query resource successfully, response:',
                queryIndividualRecordingResourceRes,
            )

            await new Promise((resolve) => setTimeout(resolve, 3000))
        }

        // Update resource
        let updateResourceRes: UpdateResourceRes
        try {
            updateResourceRes = await this.cloudRecordingClient
                .individualScenario()
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

        // Query resource
        for (let i = 0; i < 3; i++) {
            let queryIndividualRecordingResourceRes: QueryIndividualRecordingResourceRes
            try {
                queryIndividualRecordingResourceRes = await this.cloudRecordingClient
                    .individualScenario()
                    .query(resourceId, sid)
            } catch (error) {
                console.error('Failed to query resource:', error)
                return
            }
            if (queryIndividualRecordingResourceRes == undefined) {
                console.error('Failed to query resource')
                return
            }

            console.info(
                'Query resource successfully, response:',
                queryIndividualRecordingResourceRes,
            )

            await new Promise((resolve) => setTimeout(resolve, 3000))
        }

        // Stop resource
        let stopResourceRes: StopResourceRes
        try {
            stopResourceRes = await this.cloudRecordingClient
                .individualScenario()
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
