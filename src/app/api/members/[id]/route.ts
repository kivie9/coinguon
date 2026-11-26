import { NextRequest } from 'next/server';
import { memberService } from '@/services/memberService';
import { getSampleHeritageMembers } from '@/services/mappers/memberMapper';
import { getAuthenticatedUser } from '@/utils/auth';
import { apiSuccess, apiBadRequest, apiNotFound, apiForbidden, apiError } from '@/utils/apiResponse';

interface Params {
    params: Promise<{ id: string }>;
}

function parseMemberId(idStr: string): number | null {
    const id = parseInt(idStr, 10);
    return isNaN(id) ? null : id;
}

/**
 * GET /api/members/[id]
 * Lấy chi tiết hồ sơ thành viên theo ID
 * - Khách (Guest): Lấy từ dữ liệu Mock
 * - Đã đăng nhập: Lấy từ CSDL thực tế
 */
export async function GET(request: NextRequest, { params }: Params) {
    try {
        const auth = await getAuthenticatedUser(request);
        const { id } = await params;
        const memberId = parseMemberId(id);

        if (!memberId) {
            return apiBadRequest('ID thành viên không hợp lệ.');
        }

        let member = null;
        if (auth.isGuest) {
            const mockMembers = getSampleHeritageMembers();
            member = mockMembers.find((m) => m.id === memberId);
            if (!member && memberId >= 1 && memberId <= mockMembers.length) {
                member = mockMembers[memberId - 1];
            }
        } else {
            member = await memberService.getMemberByIdEnriched(memberId);
        }

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
 * Cập nhật thông tin thành viên theo ID (Yêu cầu quyền Quản Trị Viên)
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

        const body = await request.json();
        const updated = await memberService.update(memberId, body);

        if (!updated) {
            return apiNotFound('Không thể cập nhật hoặc không tìm thấy thành viên.');
        }

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

        const success = await memberService.delete(memberId);

        if (!success) {
            return apiNotFound('Không tìm thấy thành viên cần xóa.');
        }

        return apiSuccess({ id: memberId }, `Đã xóa thành viên #${memberId} thành công.`);
    } catch (error) {
        console.error('Lỗi API DELETE /api/members/[id]:', error);
        return apiError('Đã có lỗi xảy ra khi xóa thành viên.');
    }
}
