import { SavePurchases } from "@/domain/usecases"

export interface CacheStore{
    delete: (key: string) => void
    fetch: (key: string) => any
    insert: (key: string, value: any) => void
    replace: (key: string, value: any) => void
}
