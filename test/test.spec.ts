import { describe, expect, it } from "vitest"


class CreateUser {

    constructor(
        private userRepository: UserRepository
        ){}

    async execute(): Promise<void>{
        await this.userRepository.create("batata")
    }
}

interface UserRepository {
    create: (name: string) => Promise<string>
}

class UserRepositoryMock implements UserRepository {

    public async create(name: string): Promise<string>{

        return name
    }
}

describe("should return string ", () => {

    it("should work",  async () => {
        const repository = new UserRepositoryMock()
        const user = new CreateUser(repository)
 
        var result = await user.execute()

        expect(result).string

    })
})