export interface Proxy {
    id?: number
    name?: string
    cmd?: string
}

export interface SettingYaml {
    path?: string
    proxy?: Proxy []
}