import { UserEntity } from '@/database/entities/user.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache){}

    async getCacheData(id: number): Promise<any>{
        const data = await this.cacheManager.get(`${id}`)
        return data
    }

    async setCacheData(user: UserEntity): Promise<any>{
        await this.cacheManager.set(`${user.id}`,{
            user
        }, 1800000)
    }
}
