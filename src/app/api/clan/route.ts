import { NextRequest } from 'next/server';
import { clanService } from '@/services/clanService';
import { INITIAL_CLAN_DATA } from '@/config/clanData';
import { getAuthenticatedUser } from '@/utils/auth';
import { recordAuditLog } from '@/utils/auditLog';
import { ClanDto } from '@/types/clanType';
import { apiSuccess, apiBadRequest, apiForbidden, apiError } from '@/utils/apiResponse';

export async function GET(request: NextRequest) {
    try {
        const auth = await getAuthenticatedUser(request);
        const clanInfo = auth.isGuest ? { ...INITIAL_CLAN_DATA } : await clanService.getClanInfo();
        return apiSuccess(clanInfo, undefined, 200, {
            isGuest: auth.isGuest,
            role: auth.role,
            dataSource: auth.isGuest ? 'mock' : 'live',
        });
    } catch (error) {
        console.error('Lỗi khi lấy thông tin dòng tộc:', error);
        return apiError('Không thể tải thông tin dòng họ', 500);
    }
}

export async function PUT(request: NextRequest) {
    try {
        const auth = await getAuthenticatedUser(request);
        if (!auth.isAdmin && !auth.isSuperAdmin) {
            return apiForbidden('Chỉ Quản Trị Viên mới có quyền cập nhật thông tin dòng tộc.');
        }

        const body = await request.json().catch(() => ({}));
        const patch: Partial<ClanDto> = {};

        if (body.name !== undefined) {
            const name = String(body.name).trim();
            if (name.length < 2 || name.length > 150) {
                return apiBadRequest('Tên dòng họ phải từ 2 đến 150 ký tự.');
            }
            patch.name = name;
        }
        if (body.shortName !== undefined) patch.shortName = String(body.shortName).trim().slice(0, 80);
        if (body.hanNomName !== undefined) patch.hanNomName = String(body.hanNomName).trim().slice(0, 20);
        if (body.slogan !== undefined) patch.slogan = String(body.slogan).trim().slice(0, 200);
        if (body.subSlogan !== undefined) patch.subSlogan = String(body.subSlogan).trim().slice(0, 250);
        if (body.motto !== undefined) patch.motto = String(body.motto).trim().slice(0, 300);
        if (body.description !== undefined) patch.description = String(body.description).trim().slice(0, 3000);
        if (body.footerCopyright !== undefined) patch.footerCopyright = String(body.footerCopyright).trim().slice(0, 200);

        if (body.stats && body.stats.foundedYear !== undefined) {
            const year = Number(body.stats.foundedYear);
            if (Number.isInteger(year) && year > 1000 && year <= new Date().getFullYear()) {
                patch.stats = { ...INITIAL_CLAN_DATA.stats, foundedYear: year };
            }
        }

        if (body.ancestralHall && typeof body.ancestralHall === 'object') {
            patch.ancestralHall = {
                ...INITIAL_CLAN_DATA.ancestralHall,
                ...(body.ancestralHall.name !== undefined ? { name: String(body.ancestralHall.name).trim().slice(0, 150) } : {}),
                ...(body.ancestralHall.address !== undefined ? { address: String(body.ancestralHall.address).trim().slice(0, 300) } : {}),
                ...(body.ancestralHall.province !== undefined ? { province: String(body.ancestralHall.province).trim().slice(0, 100) } : {}),
                ...(body.ancestralHall.ranking !== undefined ? { ranking: String(body.ancestralHall.ranking).trim().slice(0, 150) } : {}),
            };
        }

        const updated = await clanService.updateClanInfo(patch);

        await recordAuditLog({
            userId: auth.user?.id,
            action: 'UPDATE',
            entityName: 'clans',
            entityId: Number(updated.id) || 1,
            newValues: patch as Record<string, unknown>,
            request,
        });

        return apiSuccess(updated, 'Cập nhật thông tin dòng tộc thành công');
    } catch (error) {
        console.error('Lỗi khi cập nhật thông tin dòng tộc:', error);
        return apiError('Cập nhật thông tin thất bại', 400);
    }
}
