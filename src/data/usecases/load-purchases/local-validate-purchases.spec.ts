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

    test("Should delete cache if load fails", () => {
        const { cacheStore, sut } = makeSut()
        cacheStore.simulateFetchError()
        sut.validate()
        expect(cacheStore.actions).toEqual([CacheStorageSpy.Action.fetch, CacheStorageSpy.Action.delete]) 
        expect(cacheStore.deleteKey).toBe("purchases")
    })

    test("should have no side effect if load succeeds",  () => {
        const currentDate = new Date()
        const timestamp = getCacheExpirationDate(currentDate)
        timestamp.setSeconds(timestamp.getSeconds() + 1)
        const { cacheStore, sut } = makeSut(currentDate)
        cacheStore.fetchResult = { timeStamp: timestamp }
        sut.validate()
        expect(cacheStore.actions).toEqual([CacheStorageSpy.Action.fetch]) 
        expect(cacheStore.fetchKey).toBe("purchases") 
    })




})

