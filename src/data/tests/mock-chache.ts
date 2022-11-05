import { CacheStore } from "../protocols/cache"
import { LoadPurchases, SavePurchases } from "@/domain/usecases"
import { vitest } from "vitest"

const maxAgeInDays = 3

export const getCacheExpirationDate = (timestamp: Date): Date => {
    const maxCacheAge = new Date(timestamp)
    maxCacheAge.setDate(maxCacheAge.getDate() - maxAgeInDays )
    return  maxCacheAge
}

export class CacheStorageSpy implements CacheStore {
    actions: Array<CacheStorageSpy.Action> = []
    deleteKey?: string 
    insertKey?: string
    fetchKey?: string
    insertValues: Array<SavePurchases.Params> = []
    fetchResult: any

    delete (key: string): void {
        this.actions.push(CacheStorageSpy.Action.delete)
        this.deleteKey = key
    }

    fetch (key: string): any {
        this.actions.push(CacheStorageSpy.Action.fetch)
        this.fetchKey = key
        return this.fetchResult
    }

    insert(key: string, value: any): void {
        this.actions.push(CacheStorageSpy.Action.insert)
        this.insertKey = key
        this.insertValues = value
    }

    replace(key: string, value: any): void {
        this.delete(key)
        this.insert(key, value)
    }

    simulateDeleteError (): void {
        vitest.spyOn(CacheStorageSpy.prototype, "delete").mockImplementationOnce(() => 
        { 
            this.actions.push(CacheStorageSpy.Action.delete)
            throw new Error() 
        })
    }

    simulateInsertError(): void {
        vitest.spyOn(CacheStorageSpy.prototype, "insert").mockImplementationOnce(() => 
        {
            this.actions.push(CacheStorageSpy.Action.insert)
            throw new Error() 
        })
    }

    simulateFetchError(): void {
        vitest.spyOn(CacheStorageSpy.prototype, "fetch").mockImplementationOnce(() => 
        {
            this.actions.push(CacheStorageSpy.Action.fetch)
            throw new Error() 
        })
    }

}

export namespace CacheStorageSpy {
    export enum Action {
        delete,
        insert,
        fetch
    }
}