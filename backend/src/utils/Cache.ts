import AppError from '~/errors/AppError';

interface CacheOptions {
    maxKeys: number;
}

/**
 * Simple memory cache. Can be changed to memcached/redis/fileCache in real app
 */
export default class Cache {
    private data: Record<string, any> = {};
    private keysCount = 0;
    private maxKeys = 0;

    constructor(options: CacheOptions) {
        this.maxKeys = +options.maxKeys || 0;
    }

    get(key: string | number) {
        return this.data[key];
    }

    set(key: string | number, value: any) {
        if (this.maxKeys && this.keysCount >= this.maxKeys) {
            throw new AppError('Maximum keys number exceeded');
        }
        this.data[key] = value;
        this.keysCount++;
    }

    isAble() {
        return this.keysCount < this.maxKeys;
    }
}