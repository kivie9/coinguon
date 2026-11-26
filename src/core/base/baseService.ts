export interface IBaseRepository<T, TInsert = Record<string, unknown>> {
    findAll: () => Promise<T[]>;
    findById: (id: number) => Promise<T | null>;
    create?: (data: TInsert) => Promise<T>;
    update?: (id: number, data: Partial<TInsert>) => Promise<T | null>;
    delete?: (id: number) => Promise<void>;
}

export class BaseService<T, TInsert = Record<string, unknown>> {
    constructor(protected readonly repository: IBaseRepository<T, TInsert>) { }

    async getAll(): Promise<T[]> {
        return await this.repository.findAll();
    }

    async getOne(id: number): Promise<T | null> {
        return await this.repository.findById(id);
    }
}
