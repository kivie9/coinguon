import { NextRequest } from 'next/server';
import { memberService } from '@/services/memberService';
import { getSampleHeritageMembers } from '@/services/mappers/memberMapper';
import { getAuthenticatedUser } from '@/utils/auth';
import { recordAuditLog } from '@/utils/auditLog';
import { NewMember } from '@/core/database/schema';
import { apiSuccess, apiBadRequest, apiNotFound, apiForbidden, apiError } from '@/utils/apiResponse';

interface Params {
    params: Promise<{ id: string }>;
}

function parseMemberId(idStr: string): number | null {
    const id = parseInt(idStr, 10);
    return isNaN(id) || id <= 0 ? null : id;
}

function cleanOptionalText(val: unknown, maxLen = 500): string | null {
    if (val === undefined || val === null) return null;
    const str = String(val).trim();
    return str.length > 0 ? str.slice(0, maxLen) : null;
}

function cleanOptionalInt(val: unknown): number | null {
    if (val === undefined || val === null || val === '') return null;
    const num = Number(val);
    return Number.isInteger(num) && num > 0 ? num : null;
}

/**
 * GET /api/members/[id]
 */
export async function GET(request: NextRequest, { params }: Params) {
    try {
        const auth = await getAuthenticatedUser(request);
        if (auth.isGuest) {
            return apiError('Vui lòng đăng nhập để xem hồ sơ thành viên gia phả.', 401);
        }

        const { id } = await params;
        const memberId = parseMemberId(id);

        if (!memberId) {
            return apiBadRequest('ID thành viên không hợp lệ.');
        }

        const member = await memberService.getMemberByIdEnriched(memberId);

        if (!member) {
            return apiNotFound(`Không tìm thấy thành viên với ID #${memberId}.`);
        }

        return apiSuccess(member, undefined, 200, {
            isGuest: auth.isGuest,
            role: auth.role,
            dataSource: auth.isGuest ? 'mock' : 'live',
        });
    } catch (error) {
        console.error('Lỗi API GET /api/members/[id]:', error);
        return apiError('Đã có lỗi xảy ra khi lấy thông tin thành viên.');
    }
}

/**
 * PUT /api/members/[id]
 * Cập nhật thông tin thành viên theo ID (Whitelist các trường cho phép + kiểm tra phạm vi Chi)
 */
export async function PUT(request: NextRequest, { params }: Params) {
    try {
        const auth = await getAuthenticatedUser(request);
        if (auth.isGuest) {
            return apiForbidden('Chế độ khách chỉ có quyền xem. Vui lòng đăng nhập quyền quản trị để cập nhật.');
        }
        if (!auth.isAdmin && !auth.isSuperAdmin) {
            return apiForbidden('Chỉ Quản Trị Viên mới có quyền chỉnh sửa thông tin thành viên.');
        }

        const { id } = await params;
        const memberId = parseMemberId(id);
        if (!memberId) {
            return apiBadRequest('ID thành viên không hợp lệ.');
        }

        const existing = await memberService.getOne(memberId);
        if (!existing) {
            return apiNotFound('Không tìm thấy thành viên.');
        }

        // Trưởng chi chỉ được sửa thành viên thuộc chi của mình
        if (auth.role === 'BRANCH_ADMIN' && auth.branchId && existing.branchId && existing.branchId !== auth.branchId) {
            return apiForbidden('Trưởng chi chỉ có quyền chỉnh sửa thành viên thuộc chi mình phụ trách.');
        }

        const body = await request.json().catch(() => ({}));
        const updateData: Partial<NewMember> = {};

        if (body.fullName !== undefined) {
            const name = String(body.fullName).trim();
            if (name.length < 2 || name.length > 120) {
                return apiBadRequest('Họ và tên phải từ 2 đến 120 ký tự.');
            }
            updateData.fullName = name;
        }
        if (body.courtesyName !== undefined) updateData.courtesyName = cleanOptionalText(body.courtesyName, 120);
        if (body.gender !== undefined) {
            const g = String(body.gender).toLowerCase();
            updateData.gender = g === 'female' ? 'Female' : g === 'other' ? 'Other' : 'Male';
        }
        if (body.generationNumber !== undefined) {
            const gen = Number(body.generationNumber);
            if (!Number.isInteger(gen) || gen < 1 || gen > 50) {
                return apiBadRequest('Số đời phải là số nguyên từ 1 đến 50.');
            }
            updateData.generationNumber = gen;
        }
        if (body.branchId !== undefined) {
            const nextBranchId = cleanOptionalInt(body.branchId);
            if (auth.role === 'BRANCH_ADMIN' && auth.branchId && nextBranchId && nextBranchId !== auth.branchId) {
                return apiForbidden('Trưởng chi không thể chuyển thành viên sang chi khác.');
            }
            updateData.branchId = nextBranchId;
        }
        if (body.roleTitle !== undefined) updateData.roleTitle = cleanOptionalText(body.roleTitle, 120);
        if (body.duties !== undefined) updateData.duties = cleanOptionalText(body.duties, 300);
        if (body.avatarUrl !== undefined) updateData.avatarUrl = cleanOptionalText(body.avatarUrl, 500);
        if (body.isAlive !== undefined) updateData.isAlive = Boolean(body.isAlive);
        if (body.birthdaySolar !== undefined) updateData.birthdaySolar = cleanOptionalText(body.birthdaySolar, 30);
        if (body.birthdayLunar !== undefined) updateData.birthdayLunar = cleanOptionalText(body.birthdayLunar, 50);
        if (body.deathDateSolar !== undefined) updateData.deathDateSolar = cleanOptionalText(body.deathDateSolar, 30);
        if (body.deathDayLunar !== undefined) updateData.deathDayLunar = cleanOptionalText(body.deathDayLunar, 50);
        if (body.burialPlace !== undefined) updateData.burialPlace = cleanOptionalText(body.burialPlace, 250);
        if (body.residence !== undefined) updateData.residence = cleanOptionalText(body.residence, 250);
        if (body.phone !== undefined) updateData.phone = cleanOptionalText(body.phone, 30);
        if (body.email !== undefined) updateData.email = cleanOptionalText(body.email, 120);
        if (body.bio !== undefined) updateData.bio = cleanOptionalText(body.bio, 4000);
        if (body.fatherId !== undefined) updateData.fatherId = cleanOptionalInt(body.fatherId);
        if (body.motherId !== undefined) updateData.motherId = cleanOptionalInt(body.motherId);
        if (body.spouseId !== undefined) updateData.spouseId = cleanOptionalInt(body.spouseId);

        const updated = await memberService.update(memberId, updateData);
        if (!updated) {
            return apiNotFound('Không thể cập nhật hoặc không tìm thấy thành viên.');
        }

        await recordAuditLog({
            userId: auth.user?.id,
            action: 'UPDATE',
            entityName: 'members',
            entityId: memberId,
            oldValues: { fullName: existing.fullName, generationNumber: existing.generationNumber, isAlive: existing.isAlive },
            newValues: updateData as Record<string, unknown>,
            request,
        });

        return apiSuccess(updated, 'Cập nhật thông tin thành viên thành công.');
    } catch (error) {
        console.error('Lỗi API PUT /api/members/[id]:', error);
        return apiError('Đã có lỗi xảy ra khi cập nhật thành viên.');
    }
}

/**
 * DELETE /api/members/[id]
 * Xóa mềm thành viên theo ID (Yêu cầu quyền Quản Trị Viên)
 */
export async function DELETE(request: NextRequest, { params }: Params) {
    try {
        const auth = await getAuthenticatedUser(request);
        if (auth.isGuest) {
            return apiForbidden('Chế độ khách chỉ có quyền xem. Vui lòng đăng nhập quyền quản trị để xóa.');
        }
        if (!auth.isAdmin && !auth.isSuperAdmin) {
            return apiForbidden('Chỉ Quản Trị Viên mới có quyền xóa thành viên.');
        }

        const { id } = await params;
        const memberId = parseMemberId(id);
        if (!memberId) {
            return apiBadRequest('ID thành viên không hợp lệ.');
        }

        const existing = await memberService.getOne(memberId);
        if (!existing) {
            return apiNotFound('Không tìm thấy thành viên cần xóa.');
        }

        if (auth.role === 'BRANCH_ADMIN' && auth.branchId && existing.branchId && existing.branchId !== auth.branchId) {
            return apiForbidden('Trưởng chi chỉ có quyền xóa thành viên thuộc chi mình phụ trách.');
        }

        const success = await memberService.delete(memberId);
        if (!success) {
            return apiNotFound('Không tìm thấy thành viên cần xóa.');
        }

        await recordAuditLog({
            userId: auth.user?.id,
            action: 'DELETE',
            entityName: 'members',
            entityId: memberId,
            oldValues: { fullName: existing.fullName, generationNumber: existing.generationNumber },
            request,
        });

        return apiSuccess({ id: memberId }, `Đã chuyển thành viên #${memberId} vào thùng rác.`);
    } catch (error) {
        console.error('Lỗi API DELETE /api/members/[id]:', error);
        return apiError('Đã có lỗi xảy ra khi xóa thành viên.');
    }
}
