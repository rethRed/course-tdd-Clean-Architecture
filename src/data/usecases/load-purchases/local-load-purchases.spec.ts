import { describe, expect, test, vitest } from "vitest";
import { LocalLoadPurchases } from "./local-load-purchases";
import { mockPurchases, CacheStorageSpy, getCacheExpirationDate } from "../../tests";



type SutTypes = {
    sut: LocalLoadPurchases
    cacheStore: CacheStorageSpy
}

const makeSut = (timestamp = new Date()): SutTypes => {
    const cacheStore = new CacheStorageSpy()
    const sut = new LocalLoadPurchases(cacheStore, timestamp)

    return {
        sut,
        cacheStore,
    }
}


describe("localSavePurchases", () => {
    test("Should not delete or insert cache cache on sut.init", () => {
        const { cacheStore } = makeSut()
        expect(cacheStore.actions).toEqual([])
    })

    test("Should return empty list if load fails", async () => {
        const { cacheStore, sut } = makeSut()
        cacheStore.simulateFetchError()
        const purchases = await sut.loadAll()
        expect(cacheStore.actions).toEqual([CacheStorageSpy.Action.fetch]) 
        expect(purchases).toEqual([])
    })

    
    test("should return a list of purchases if cache is valid", async () => {
        const currentDate = new Date()
        const timestamp = getCacheExpirationDate(currentDate)
        timestamp.setSeconds(timestamp.getSeconds() + 1)
        const { cacheStore, sut } = makeSut(currentDate)
        cacheStore.fetchResult = {
            timeStamp: timestamp,
            value: mockPurchases()
        }
        const purchases = await sut.loadAll()
        expect(cacheStore.actions).toEqual([CacheStorageSpy.Action.fetch]) 
        expect(purchases).toEqual(cacheStore.fetchResult.value)
        expect(cacheStore.fetchKey).toBe("purchases") 
    })
    
    test("should return an empty list of purchases if cache is expired", async () => {
        const currentDate = new Date()
        const timestamp = getCacheExpirationDate(currentDate)
        const { cacheStore, sut } = makeSut(currentDate)
        cacheStore.fetchResult = {
            timeStamp: timestamp,
            value: mockPurchases()
        }
        const purchases = await sut.loadAll()
        expect(cacheStore.actions).toEqual([CacheStorageSpy.Action.fetch]) 
        expect(purchases).toEqual([])
        expect(cacheStore.fetchKey).toBe("purchases") 

    })
    
    test("should return an empty list of purchases if cache is empty", async () => {
        const currentDate = new Date()
        const timestamp = getCacheExpirationDate(currentDate)
        timestamp.setSeconds(timestamp.getSeconds() + 1)
        const { cacheStore, sut } = makeSut(currentDate)
        cacheStore.fetchResult = {
            timeStamp: timestamp,
            value: []
        }
        const purchases = await sut.loadAll()
        expect(cacheStore.actions).toEqual([CacheStorageSpy.Action.fetch]) 
        expect(purchases).toEqual([])
        expect(cacheStore.fetchKey).toBe("purchases") 
    })


})

