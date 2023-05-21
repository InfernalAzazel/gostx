export interface ProxyInterface {
    id?: number
    name?: string
    cmd?: string
}

export interface ProxyYamlInterface {
    proxy?: Proxy []
}