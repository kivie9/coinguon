import {
    sqliteTable,
    text,
    integer,
    index,
} from 'drizzle-orm/sqlite-core';
import { clans, branches } from './clans';

/**
 * Bảng Thành viên gia phả (members) - Bản ghi phả hệ cốt lõi (SQLite / Cloudflare D1)
 */
export const members = sqliteTable(
    'members',
    {
        id: integer('id').primaryKey({ autoIncrement: true }),
        clanId: integer('clan_id').references(() => clans.id, { onDelete: 'set null' }),
        branchId: integer('branch_id').references(() => branches.id, { onDelete: 'set null' }),

        // Danh tính & Vai vế
        fullName: text('full_name').notNull(),
        courtesyName: text('courtesy_name'),
        gender: text('gender'), // 'Male' | 'Female' | 'Other'
        generationNumber: integer('generation_number').default(1).notNull(),
        roleTitle: text('role_title'),
        duties: text('duties'),
        avatarUrl: text('avatar_url'),

        // Niên biểu Sinh - Tử (Âm lịch & Dương lịch)
        isAlive: integer('is_alive', { mode: 'boolean' }).default(true).notNull(),
        birthdaySolar: text('birthday_solar'), // ISO YYYY-MM-DD
        birthdayLunar: text('birthday_lunar'),
        deathDateSolar: text('death_date_solar'), // ISO YYYY-MM-DD
        deathDayLunar: text('death_day_lunar'),

        // Địa danh & Mộ phần
        burialPlace: text('burial_place'),
        residence: text('residence'),
        ancestralOrigin: text('ancestral_origin'),

        // Liên lạc & Học vị
        phone: text('phone'),
        email: text('email'),
        academicLevel: text('academic_level'),
        career: text('career'),

        // Tiểu sử & Công trạng
        bio: text('bio'),
        badgeType: text('badge_type'),

        // Fast Tree Traversal
        fatherId: integer('father_id'),
        motherId: integer('mother_id'),
        spouseId: integer('spouse_id'),
        birthOrder: integer('birth_order'),

        // Soft delete & Timestamps
        deletedAt: integer('deleted_at', { mode: 'timestamp' }),
        createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
        updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
    },
    (table) => [
        index('idx_members_generation').on(table.generationNumber),
        index('idx_members_branch_id').on(table.branchId),
        index('idx_members_is_alive').on(table.isAlive),
        index('idx_members_death_lunar').on(table.deathDayLunar),
        index('idx_members_father_id').on(table.fatherId),
        index('idx_members_mother_id').on(table.motherId),
    ]
);

export const RelationshipTypeEnum = {
    PARENT_CHILD: 'PARENT_CHILD',
    SPOUSE: 'SPOUSE',
    ADOPTED: 'ADOPTED',
    IN_LAW: 'IN_LAW',
} as const;

export type RelationshipType = keyof typeof RelationshipTypeEnum;

/**
 * Bảng Mối quan hệ đa chiều giữa các thành viên (relationships)
 */
export const relationships = sqliteTable(
    'relationships',
    {
        id: integer('id').primaryKey({ autoIncrement: true }),
        personId: integer('person_id')
            .notNull()
            .references(() => members.id, { onDelete: 'cascade' }),
        relatedPersonId: integer('related_person_id')
            .notNull()
            .references(() => members.id, { onDelete: 'cascade' }),
        type: text('type').notNull(),
        marriageOrder: integer('marriage_order'),
        orderInFamily: integer('order_in_family'),
        note: text('note'),
        createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
    },
    (table) => [
        index('idx_rel_person_type').on(table.personId, table.type),
        index('idx_rel_related_person').on(table.relatedPersonId),
    ]
);

/**
 * Bảng Bằng khen & Tuyên dương công đức (member_honors)
 */
export const memberHonors = sqliteTable(
    'member_honors',
    {
        id: integer('id').primaryKey({ autoIncrement: true }),
        memberId: integer('member_id')
            .notNull()
            .references(() => members.id, { onDelete: 'cascade' }),
        title: text('title').notNull(),
        description: text('description').notNull(),
        year: text('year'),
        badgeType: text('badge_type').default('star'),
        certificateUrl: text('certificate_url'),
        createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
    },
    (table) => [
        index('idx_member_honors_member_id').on(table.memberId),
    ]
);

/**
 * Bảng Album Di ảnh & Kỷ niệm thành viên (member_media)
 */
export const memberMedia = sqliteTable(
    'member_media',
    {
        id: integer('id').primaryKey({ autoIncrement: true }),
        memberId: integer('member_id')
            .notNull()
            .references(() => members.id, { onDelete: 'cascade' }),
        mediaType: text('media_type').default('photo').notNull(),
        url: text('url').notNull(),
        caption: text('caption').notNull(),
        year: text('year'),
        isPortrait: integer('is_portrait', { mode: 'boolean' }).default(false).notNull(),
        sortOrder: integer('sort_order').default(0),
        createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
    },
    (table) => [
        index('idx_member_media_member_id').on(table.memberId),
    ]
);

export type Member = typeof members.$inferSelect;
export type NewMember = typeof members.$inferInsert;

export type Relationship = typeof relationships.$inferSelect;
export type NewRelationship = typeof relationships.$inferInsert;

export type MemberHonor = typeof memberHonors.$inferSelect;
export type NewMemberHonor = typeof memberHonors.$inferInsert;

export type MemberMediaItem = typeof memberMedia.$inferSelect;
export type NewMemberMediaItem = typeof memberMedia.$inferInsert;
