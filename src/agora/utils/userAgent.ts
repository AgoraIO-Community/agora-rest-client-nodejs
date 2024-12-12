import { version } from '../../../package.json'

export const getUserAgent = (): string => {
    return `AgoraRESTClient  Language/javaScript LanguageVersion/${process.version} Arch/${process.arch} OS/${process.platform} SDKVersion/${version}`
}
