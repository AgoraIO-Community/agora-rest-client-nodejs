import {
    DomainArea,
    Credential,
    AcquireResourceRes,
    QueryWebRecordingResourceRes,
    RtmpPublishServiceParam,
    StartResourceRes,
    StopResourceRes,
    StorageConfig,
    UpdateResourceRes,
    WebRecordingServiceParam,
} from '../../../src'
import { BaseScenario } from '../base'

export class WebRecordingService extends BaseScenario {
    constructor(
        domainArea: DomainArea,
        appId: string,
        cname: string,
        uid: string,
        credential: Credential,
    ) {
        super(domainArea, appId, cname, uid, credential)
    }

    async runWebRecorder(storageConfig: StorageConfig): Promise<void> {
        // Acquire resource
        let acquireResourceRes: AcquireResourceRes
        try {
            acquireResourceRes = await this.cloudRecordingClient
                .webScenario()
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
                .webScenario()
                .start(this.cname, this.uid, resourceId, {
                    recordingFileConfig: {
                        avFileType: ['hls', 'mp4'],
                    },
                    extensionServiceConfig: {
                        errorHandlePolicy: 'error_abort',
                        extensionServices: [
                            {
                                serviceName: 'web_recorder_service',
                                errorHandlePolicy: 'error_abort',
                                serviceParam: {
                                    url: 'https://live.bilibili.com/',
                                    audioProfile: 2,
                                    videoWidth: 1280,
                                    videoHeight: 720,
                                    maxRecordingHour: 1,
                                } as WebRecordingServiceParam,
                            },
                        ],
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
            let queryWebRecordingResourceRes: QueryWebRecordingResourceRes
            try {
                queryWebRecordingResourceRes = await this.cloudRecordingClient
                    .webScenario()
                    .query(resourceId, sid)
            } catch (error) {
                console.error('Failed to query resource:', error)
                return
            }
            if (queryWebRecordingResourceRes == undefined) {
                console.error('Failed to query resource')
                return
            }

            console.info('Query resource successfully, response:', queryWebRecordingResourceRes)

            await new Promise((resolve) => setTimeout(resolve, 3000))
        }

        // Update resource
        let updateResourceRes: UpdateResourceRes
        try {
            updateResourceRes = await this.cloudRecordingClient
                .webScenario()
                .update(this.cname, this.uid, resourceId, sid, {
                    webRecordingConfig: {
                        onhold: true,
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
            let queryWebRecordingResourceRes: QueryWebRecordingResourceRes
            try {
                queryWebRecordingResourceRes = await this.cloudRecordingClient
                    .webScenario()
                    .query(resourceId, sid)
            } catch (error) {
                console.error('Failed to query resource:', error)
                return
            }
            if (queryWebRecordingResourceRes == undefined) {
                console.error('Failed to query resource')
                return
            }

            console.info('Query resource successfully, response:', queryWebRecordingResourceRes)

            await new Promise((resolve) => setTimeout(resolve, 3000))
        }

        // Stop resource
        let stopResourceRes: StopResourceRes
        try {
            stopResourceRes = await this.cloudRecordingClient
                .webScenario()
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

    async runWebRecorderAndRtmpPublish(storageConfig: StorageConfig): Promise<void> {
        // Acquire resource
        let acquireResourceRes: AcquireResourceRes
        try {
            acquireResourceRes = await this.cloudRecordingClient
                .webScenario()
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
                .webScenario()
                .start(this.cname, this.uid, resourceId, {
                    recordingFileConfig: {
                        avFileType: ['hls', 'mp4'],
                    },
                    extensionServiceConfig: {
                        errorHandlePolicy: 'error_abort',
                        extensionServices: [
                            {
                                serviceName: 'web_recorder_service',
                                errorHandlePolicy: 'error_abort',
                                serviceParam: {
                                    url: 'https://live.bilibili.com/',
                                    audioProfile: 2,
                                    videoWidth: 1280,
                                    videoHeight: 720,
                                    maxRecordingHour: 1,
                                } as WebRecordingServiceParam,
                            },
                            {
                                serviceName: 'rtmp_publish_service',
                                errorHandlePolicy: 'error_ignore',
                                serviceParam: {
                                    outputs: [
                                        {
                                            rtmpUrl: 'rtmp://xxx.xxx.xxx.xxx:1935/live/test',
                                        },
                                    ],
                                } as RtmpPublishServiceParam,
                            },
                        ],
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
            let queryWebRecordingResourceRes: QueryWebRecordingResourceRes
            try {
                queryWebRecordingResourceRes = await this.cloudRecordingClient
                    .webScenario()
                    .query(resourceId, sid)
            } catch (error) {
                console.error('Failed to query resource:', error)
                return
            }
            if (queryWebRecordingResourceRes == undefined) {
                console.error('Failed to query resource')
                return
            }

            console.info('Query resource successfully, response:', queryWebRecordingResourceRes)

            await new Promise((resolve) => setTimeout(resolve, 3000))
        }

        // Update resource
        let updateResourceRes: UpdateResourceRes
        try {
            updateResourceRes = await this.cloudRecordingClient
                .webScenario()
                .update(this.cname, this.uid, resourceId, sid, {
                    webRecordingConfig: {
                        onhold: true,
                    },
                    rtmpPublishConfig: {
                        outputs: [
                            {
                                rtmpUrl: 'rtmp://yyy.yyy.yyy.yyy:1935/live/test',
                            },
                        ],
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
            let queryWebRecordingResourceRes: QueryWebRecordingResourceRes
            try {
                queryWebRecordingResourceRes = await this.cloudRecordingClient
                    .webScenario()
                    .query(resourceId, sid)
            } catch (error) {
                console.error('Failed to query resource:', error)
                return
            }
            if (queryWebRecordingResourceRes == undefined) {
                console.error('Failed to query resource')
                return
            }

            console.info('Query resource successfully, response:', queryWebRecordingResourceRes)

            await new Promise((resolve) => setTimeout(resolve, 3000))
        }

        // Stop resource
        let stopResourceRes: StopResourceRes
        try {
            stopResourceRes = await this.cloudRecordingClient
                .webScenario()
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
