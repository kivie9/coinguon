import type { SQLiteColumn, SQLiteTable } from 'drizzle-orm/sqlite-core';
import { eq, and, isNull, SQL } from 'drizzle-orm';
import { db, type AppDatabase } from '@/core/database/dataSource';

export interface IdentifiableTable {
    id: SQLiteColumn;
    deletedAt?: SQLiteColumn;
    updatedAt?: SQLiteColumn;
}

export abstract class BaseRepository<
    TTable extends SQLiteTable & IdentifiableTable,
    TSelect extends Record<string, unknown>,
    TInsert extends Record<string, unknown>
> {
    constructor(
        protected readonly table: TTable,
        protected readonly database: AppDatabase = db
    ) {}

    protected get db(): AppDatabase {
        return this.database;
    }

    /**
     * Lấy toàn bộ bản ghi (mặc định loại bỏ các bản ghi đã xóa mềm)
     */
    async findAll(): Promise<TSelect[]> {
        if ('deletedAt' in this.table && this.table.deletedAt) {
            const records = await this.db
                .select()
                .from(this.table as never)
                .where(isNull(this.table.deletedAt));
            return records as unknown as TSelect[];
        }
        const records = await this.db.select().from(this.table as never);
        return records as unknown as TSelect[];
    }

    /**
     * Tìm bản ghi theo ID
     */
    async findById(id: number): Promise<TSelect | null> {
        const conditions: (SQL | undefined)[] = [eq(this.table.id, id)];

        if ('deletedAt' in this.table && this.table.deletedAt) {
            conditions.push(isNull(this.table.deletedAt));
        }

        const results = (await this.db
            .select()
            .from(this.table as never)
            .where(and(...conditions))
            .limit(1)) as unknown as TSelect[];

        return results[0] ?? null;
    }

    /**
     * Thêm mới bản ghi
     */
    async create(data: TInsert): Promise<TSelect> {
        const results = (await this.db
            .insert(this.table as never)
            .values(data as never)
            .returning()) as unknown as TSelect[];
        return results[0];
    }

    /**
     * Cập nhật bản ghi theo ID
     */
    async update(id: number, data: Partial<TInsert>): Promise<TSelect | null> {
        const updateData: Record<string, unknown> = { ...data };
        if ('updatedAt' in this.table && this.table.updatedAt) {
            updateData.updatedAt = new Date();
        }

        const results = (await this.db
            .update(this.table as never)
            .set(updateData as never)
            .where(eq(this.table.id, id))
            .returning()) as unknown as TSelect[];

        return results[0] ?? null;
    }

    /**
     * Xóa mềm (nếu có cột deletedAt) hoặc xóa vĩnh viễn theo ID
     */
    async delete(id: number): Promise<void> {
        if ('deletedAt' in this.table && this.table.deletedAt) {
            await this.db
                .update(this.table as never)
                .set({ deletedAt: new Date() } as never)
                .where(eq(this.table.id, id));
            return;
        }

        await this.db.delete(this.table as never).where(eq(this.table.id, id));
    }
}
