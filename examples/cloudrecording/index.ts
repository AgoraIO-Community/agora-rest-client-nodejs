import { Command, OptionValues } from 'commander'
import { MixRecordingService } from './mix'
import { IndividualRecordingService } from './individual'
import { WebRecordingService } from './web'
import { BasicCredential, DomainArea } from '../../src'

const appId = process.env.APP_ID ?? ''
const cname = process.env.CNAME ?? ''
const uid = process.env.USER_ID ?? ''
const username = process.env.BASIC_AUTH_USERNAME ?? ''
const password = process.env.BASIC_AUTH_PASSWORD ?? ''
const token = process.env.TOKEN ?? ''
const domainArea = DomainArea.CN

if (!appId || !cname || !uid || !username || !password) {
    console.error('Required environment variables are missing')
    process.exit(1)
}

const credential = new BasicCredential(username, password)

const storageConfig = {
    vendor: parseInt(process.env.STORAGE_CONFIG_VENDOR || '0', 10),
    region: parseInt(process.env.STORAGE_CONFIG_REGION || '0', 10),
    bucket: process.env.STORAGE_CONFIG_BUCKET,
    accessKey: process.env.STORAGE_CONFIG_ACCESS_KEY,
    secretKey: process.env.STORAGE_CONFIG_SECRET_KEY,
    fileNamePrefix: ['recordings'],
}

if (
    !storageConfig.vendor ||
    !storageConfig.region ||
    !storageConfig.bucket ||
    !storageConfig.accessKey ||
    !storageConfig.secretKey
) {
    console.error('Required storage configuration environment variables are missing')
    process.exit(1)
}

const program = new Command()
program
    .option('--mode <mode>', 'recording mode, options are mix/individual/web', '')
    .option('--mix_scene <scene>', 'scene for mix mode, options are hls/hls_and_mp4', '')
    .option(
        '--individual_scene <scene>',
        'scene for individual mode, options are recording/snapshot/recording_and_snapshot/recording_and_postpone_transcoding/recording_and_audio_mix',
        '',
    )
    .option(
        '--web_scene <scene>',
        'scene for web mode, options are web_recorder/web_recorder_and_rtmp_publish',
        '',
    )
    .action(async () => {
        const options = program.opts()
        await runService(options)
    })
    .parseAsync(process.argv)
async function runService(options: OptionValues): Promise<void> {
    console.log('Running service with options:', options)
    switch (options.mode) {
        case 'mix':
            await runMixService(options.mix_scene)
            break
        case 'individual':
            await runIndividualService(options.individual_scene)
            break
        case 'web':
            await runWebService(options.web_scene)
            break
        default:
            throw new Error('Invalid mode')
    }
}

async function runMixService(scene: string): Promise<void> {
    const mixRecordingService = new MixRecordingService(domainArea, appId, cname, uid, credential)
    switch (scene) {
        case 'hls':
            await mixRecordingService.runHLS(token, storageConfig)
            break
        case 'hls_and_mp4':
            await mixRecordingService.runHLSAndMP4(token, storageConfig)
            break
        default:
            throw new Error('Invalid mix_scene')
    }
}

async function runIndividualService(scene: string): Promise<void> {
    const individualRecordingService = new IndividualRecordingService(
        domainArea,
        appId,
        cname,
        uid,
        credential,
    )
    switch (scene) {
        case 'recording':
            await individualRecordingService.runRecording(token, storageConfig)
            break
        case 'snapshot':
            await individualRecordingService.runSnapshot(token, storageConfig)
            break
        case 'recording_and_snapshot':
            await individualRecordingService.runRecordingAndSnapshot(token, storageConfig)
            break
        default:
            throw new Error('Invalid individual_scene')
    }
}

async function runWebService(scene: string): Promise<void> {
    const webRecordingService = new WebRecordingService(domainArea, appId, cname, uid, credential)
    switch (scene) {
        case 'web_recorder':
            await webRecordingService.runWebRecorder(storageConfig)
            break
        case 'web_recorder_and_rtmp_publish':
            await webRecordingService.runWebRecorderAndRtmpPublish(storageConfig)
            break
        default:
            throw new Error('Invalid web_scene')
    }
}
