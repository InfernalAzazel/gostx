export interface Proxy {
    id?: number
    name?: string
    cmd?: string
}

export interface ProxyYaml {
    proxy?: Proxy []
}