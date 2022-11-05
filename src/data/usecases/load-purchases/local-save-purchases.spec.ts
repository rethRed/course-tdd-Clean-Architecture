import { describe, expect, test, vitest } from "vitest";
import { CacheStore } from "@/data/protocols/cache";
import { LocalLoadPurchases } from "./local-load-purchases";
import { SavePurchases } from "@/domain/usecases";
import { mockPurchases, CacheStorageSpy } from "../../tests";



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

        const { cacheStore, sut } = makeSut()

        expect(cacheStore.actions).toEqual([])
    })

    test("Should delete old cache on sut.init", async () => {

        const { cacheStore, sut } = makeSut()
        await sut.save(mockPurchases())

        expect(cacheStore.actions).toEqual([CacheStorageSpy.Action.delete, CacheStorageSpy.Action.insert,])
        expect(cacheStore.deleteKey).toBe("purchases")

    })

    test("Should not insert new Cache if delete fails ", () => {

        const { cacheStore, sut } = makeSut()

        cacheStore.simulateDeleteError()
        const promise =  sut.save(mockPurchases())

        expect(cacheStore.actions).toEqual([CacheStorageSpy.Action.delete])
        expect(promise).rejects.toThrow()
        

    })

    test("Should insert new Cache if delete succeeds ", async () => {

        const timestamp = new Date()
        const { cacheStore, sut } = makeSut(timestamp)

        const purchases = mockPurchases()

        const promise = sut.save(purchases)

        expect(cacheStore.actions).toEqual([CacheStorageSpy.Action.delete, CacheStorageSpy.Action.insert,])
        expect(cacheStore.insertKey).toBe("purchases")
        expect(cacheStore.insertValues).toEqual({
            timestamp,
            value: purchases
        })
        expect(promise).resolves.toBeFalsy()
    })

    
    test("Should throw if insert throws ",  () => {

        const { cacheStore, sut } = makeSut()

        cacheStore.simulateInsertError()
        const promise =  sut.save(mockPurchases())
        expect(cacheStore.actions).toEqual([CacheStorageSpy.Action.delete, CacheStorageSpy.Action.insert,])
        expect(promise).rejects.toThrow()
        

    })



})

