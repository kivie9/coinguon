import {
    sqliteTable,
    text,
    integer,
    index,
} from 'drizzle-orm/sqlite-core';

/**
 * Bảng Dòng họ (clans) - Lưu trữ thông tin đại tông / chi tộc tối cao (SQLite / Cloudflare D1)
 */
export const clans = sqliteTable(
    'clans',
    {
        id: integer('id').primaryKey({ autoIncrement: true }),
        code: text('code').notNull().unique(), // vd: 'le-toc-dai-ton'
        name: text('name').notNull(), // 'Lê Tộc Đại Tôn'
        shortName: text('short_name'), // 'Lê Tộc'
        hanNomName: text('han_nom_name'), // Chữ Hán Nôm / Đại tự dòng tộc (vd: '黎' hoặc '黎族大宗')
        slogan: text('slogan'),
        subSlogan: text('sub_slogan'),
        motto: text('motto'),
        foundedYear: integer('founded_year'),
        description: text('description'),
        logoUrl: text('logo_url'),
        footerCopyright: text('footer_copyright'),
        createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
        updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
    },
    (table) => [
        index('idx_clans_code').on(table.code),
    ]
);

/**
 * Bảng Chi phái dòng họ (branches)
 */
export const branches = sqliteTable(
    'branches',
    {
        id: integer('id').primaryKey({ autoIncrement: true }),
        clanId: integer('clan_id').references(() => clans.id, { onDelete: 'cascade' }),
        name: text('name').notNull(),
        branchTitle: text('branch_title'),
        branchFullTitle: text('branch_full_title'),
        leaderId: integer('leader_id'),
        ancestralPlace: text('ancestral_place'),
        contactInfo: text('contact_info'),
        orderIndex: integer('order_index').default(1),
        createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
        updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
    },
    (table) => [
        index('idx_branches_clan_id').on(table.clanId),
    ]
);

/**
 * Bảng Từ đường / Nhà thờ họ (ancestral_halls)
 */
export const ancestralHalls = sqliteTable(
    'ancestral_halls',
    {
        id: integer('id').primaryKey({ autoIncrement: true }),
        clanId: integer('clan_id').references(() => clans.id, { onDelete: 'cascade' }),
        name: text('name').notNull(),
        shortName: text('short_name'),
        address: text('address').notNull(),
        province: text('province'),
        foundedYear: integer('founded_year'),
        ranking: text('ranking'),
        structure: text('structure'),
        mapsQueryUrl: text('maps_query_url'),
        imageUrl: text('image_url'),
        managerName: text('manager_name'),
        managerPhone: text('manager_phone'),
        createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
        updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
    },
    (table) => [
        index('idx_ancestral_halls_clan_id').on(table.clanId),
    ]
);

/**
 * Bảng Tư liệu & Sắc phong lịch sử dòng họ (clan_documents)
 */
export const clanDocuments = sqliteTable(
    'clan_documents',
    {
        id: integer('id').primaryKey({ autoIncrement: true }),
        clanId: integer('clan_id').references(() => clans.id, { onDelete: 'cascade' }),
        title: text('title').notNull(),
        description: text('description'),
        tag: text('tag'),
        fileUrl: text('file_url').notNull(),
        publishedYear: integer('published_year'),
        createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
        updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
    },
    (table) => [
        index('idx_clan_documents_clan_id').on(table.clanId),
    ]
);

export type Clan = typeof clans.$inferSelect;
export type NewClan = typeof clans.$inferInsert;

export type Branch = typeof branches.$inferSelect;
export type NewBranch = typeof branches.$inferInsert;

export type AncestralHall = typeof ancestralHalls.$inferSelect;
export type NewAncestralHall = typeof ancestralHalls.$inferInsert;

export type ClanDocument = typeof clanDocuments.$inferSelect;
export type NewClanDocument = typeof clanDocuments.$inferInsert;
