import { NextRequest } from 'next/server';
import { memberService } from '@/services/memberService';
import { getSampleHeritageMembers } from '@/services/mappers/memberMapper';
import { getAuthenticatedUser } from '@/utils/auth';
import { recordAuditLog } from '@/utils/auditLog';
import { apiSuccess, apiBadRequest, apiForbidden, apiError } from '@/utils/apiResponse';
import { matchesSearchQuery } from '@/utils/memberUtils';

const VALID_GENDERS = ['Male', 'Female', 'Other', 'MALE', 'FEMALE', 'OTHER'];

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
 * GET /api/members
 * - Khách (Guest): Trả về dữ liệu MOCK (dữ liệu mẫu)
 * - Đã đăng nhập (Member / Admin): Trả về dữ liệu THỰC TẾ từ CSDL
 */
export async function GET(request: NextRequest) {
    try {
        const auth = await getAuthenticatedUser(request);
        if (auth.isGuest) {
            return apiError('Vui lòng đăng nhập để xem danh sách thành viên gia phả.', 401);
        }

        const { searchParams } = new URL(request.url);
        const generationParam = searchParams.get('generation');
        const searchParam = searchParams.get('search');

        let membersList = await memberService.getAllEnrichedMembers();

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

        const body = await request.json().catch(() => ({}));
        const fullName = String(body.fullName || '').trim();
        const gender = String(body.gender || '').trim();
        const generationNumber = Number(body.generationNumber);

        if (!fullName || fullName.length < 2 || fullName.length > 120) {
            return apiBadRequest('Họ và tên thành viên phải từ 2 đến 120 ký tự.');
        }
        if (!VALID_GENDERS.includes(gender)) {
            return apiBadRequest('Giới tính không hợp lệ (Male, Female, Other).');
        }
        if (!Number.isInteger(generationNumber) || generationNumber < 1 || generationNumber > 50) {
            return apiBadRequest('Số đời (generationNumber) phải là số nguyên từ 1 đến 50.');
        }

        let branchId = cleanOptionalInt(body.branchId);
        // Trưởng chi chỉ được thêm thành viên vào chi của mình (nếu tài khoản đã gán chi)
        if (auth.role === 'BRANCH_ADMIN' && auth.branchId) {
            if (branchId && branchId !== auth.branchId) {
                return apiForbidden('Trưởng chi chỉ có quyền thêm thành viên thuộc chi mình phụ trách.');
            }
            branchId = auth.branchId;
        }

        const normalizedGender =
            gender.toLowerCase() === 'female'
                ? 'Female'
                : gender.toLowerCase() === 'other'
                  ? 'Other'
                  : 'Male';

        const newMember = await memberService.create({
            fullName,
            courtesyName: cleanOptionalText(body.courtesyName, 120),
            gender: normalizedGender,
            generationNumber,
            branchId,
            roleTitle: cleanOptionalText(body.roleTitle, 120),
            duties: cleanOptionalText(body.duties, 300),
            avatarUrl: cleanOptionalText(body.avatarUrl, 500),
            birthdaySolar: cleanOptionalText(body.birthdaySolar, 30),
            birthdayLunar: cleanOptionalText(body.birthdayLunar, 50),
            deathDateSolar: cleanOptionalText(body.deathDateSolar, 30),
            deathDayLunar: cleanOptionalText(body.deathDayLunar, 50),
            isAlive: body.isAlive !== undefined ? Boolean(body.isAlive) : true,
            burialPlace: cleanOptionalText(body.burialPlace, 250),
            residence: cleanOptionalText(body.residence, 250),
            phone: cleanOptionalText(body.phone, 30),
            email: cleanOptionalText(body.email, 120),
            bio: cleanOptionalText(body.bio, 4000),
            fatherId: cleanOptionalInt(body.fatherId),
            motherId: cleanOptionalInt(body.motherId),
            spouseId: cleanOptionalInt(body.spouseId),
        });

        await recordAuditLog({
            userId: auth.user?.id,
            action: 'INSERT',
            entityName: 'members',
            entityId: newMember.id,
            newValues: { fullName: newMember.fullName, generationNumber: newMember.generationNumber, branchId: newMember.branchId },
            request,
        });

        return apiSuccess(newMember, 'Thêm thành viên mới thành công.', 201);
    } catch (error) {
        console.error('Lỗi API POST /api/members:', error);
        return apiError('Đã có lỗi xảy ra khi thêm thành viên mới.');
    }
}
