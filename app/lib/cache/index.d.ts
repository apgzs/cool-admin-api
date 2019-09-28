
export interface Config {
    resolver?: (...args: any[]) => string | number;
    ttl?: number; // 缓存过期时间
    url?: string; // url包含改前缀才缓存  如api请求时缓存  admin请求时不缓存
}
export declare function Cache(config?: Config): (target: object, propertyName: string, propertyDesciptor: PropertyDescriptor) => PropertyDescriptor;
export declare function ClearCache();
