import { NextRequest } from 'next/server';
import { memberService } from '@/services/memberService';
import { getSampleHeritageMembers } from '@/services/mappers/memberMapper';
import { getAuthenticatedUser } from '@/utils/auth';
import { apiSuccess, apiBadRequest, apiForbidden, apiError } from '@/utils/apiResponse';
import { matchesSearchQuery } from '@/utils/memberUtils';

/**
 * GET /api/members
 * - Khách (Guest): Trả về dữ liệu MOCK (dữ liệu mẫu)
 * - Đã đăng nhập (Member / Admin): Trả về dữ liệu THỰC TẾ từ CSDL
 */
export async function GET(request: NextRequest) {
    try {
        const auth = await getAuthenticatedUser(request);
        const { searchParams } = new URL(request.url);
        const generationParam = searchParams.get('generation');
        const searchParam = searchParams.get('search');

        // Phân quyền dữ liệu: Khách dùng Mock, Đăng nhập dùng Live DB
        let membersList = auth.isGuest
            ? getSampleHeritageMembers()
            : await memberService.getAllEnrichedMembers();

        if (generationParam) {
            const gen = parseInt(generationParam, 10);
            if (!isNaN(gen)) {
                membersList = membersList.filter((m) => m.generationNumber === gen);
            }
        }

        if (searchParam && searchParam.trim()) {
            membersList = membersList.filter((m) => matchesSearchQuery(m, searchParam));
        }

        return apiSuccess(membersList, undefined, 200, {
            total: membersList.length,
            isGuest: auth.isGuest,
            role: auth.role,
            dataSource: auth.isGuest ? 'mock' : 'live',
        });
    } catch (error) {
        console.error('Lỗi API GET /api/members:', error);
        return apiError('Không thể lấy danh sách thành viên từ máy chủ.');
    }
}

/**
 * POST /api/members
 * Đăng ký / thêm mới thành viên dòng tộc (Yêu cầu quyền Quản Trị Viên)
 */
export async function POST(request: NextRequest) {
    try {
        const auth = await getAuthenticatedUser(request);
        if (auth.isGuest) {
            return apiForbidden('Chế độ khách chỉ có quyền xem dữ liệu mẫu. Vui lòng đăng nhập tài khoản quản trị để thêm thành viên.');
        }
        if (!auth.isAdmin && !auth.isSuperAdmin) {
            return apiForbidden('Chỉ Quản Trị Viên mới có quyền đăng ký hoặc thêm thành viên vào phả hệ.');
        }

        const body = await request.json();

        if (!body.fullName || !body.gender || body.generationNumber === undefined) {
            return apiBadRequest('Thiếu thông tin bắt buộc: fullName, gender, generationNumber.');
        }

        const newMember = await memberService.create({
            fullName: body.fullName,
            gender: body.gender,
            generationNumber: Number(body.generationNumber),
            birthdaySolar: body.birthdaySolar || null,
            birthdayLunar: body.birthdayLunar || null,
            deathDayLunar: body.deathDayLunar || null,
            isAlive: body.isAlive !== undefined ? Boolean(body.isAlive) : true,
            bio: body.bio || null,
        });

        return apiSuccess(newMember, 'Thêm thành viên mới thành công.', 201);
    } catch (error) {
        console.error('Lỗi API POST /api/members:', error);
        return apiError('Không thể thêm thành viên. Vui lòng thử lại sau.');
    }
}
