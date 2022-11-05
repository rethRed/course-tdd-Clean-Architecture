import {  CacheStore, CachePolicy } from "../../protocols/cache"
import { LoadPurchases, SavePurchases } from "@/domain/usecases"
import { PurchaseModel } from "@/domain/models"

export class LocalLoadPurchases implements SavePurchases, LoadPurchases{
    private readonly key = "purchases"
    constructor(
        private readonly cacheStore: CacheStore,
        private readonly currentDate: Date 
    ){}

    async save(purchases: Array<SavePurchases.Params>): Promise<void>{
        this.cacheStore.replace(this.key, {
            timestamp: this.currentDate,
            value: purchases
        })
    }

    async loadAll(): Promise<Array<LoadPurchases.Result>> {

        try{
            const cache = this.cacheStore.fetch(this.key)
            const maxAge = new Date(cache.timeStamp)
            maxAge.setDate(maxAge.getDate() + 3)
            if(CachePolicy.validate(cache.timeStamp, this.currentDate)){
                return cache.value
            }else {
  
                return []
            }
            
        }catch(error) {
            return []
        }

    }

    validate(): void {

        try {
            this.cacheStore.fetch(this.key)
        }catch (error) {
            this.cacheStore.delete(this.key)
        }
    }

}
