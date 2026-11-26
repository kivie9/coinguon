import { memberService } from '@/services/memberService';
import { apiSuccess, apiError } from '@/utils/apiResponse';

/**
 * GET /api/members/generations
 * Lấy danh sách các đời/thế hệ động từ CSDL kèm danh xưng và thống kê số lượng thành viên
 */
export async function GET() {
    try {
        const stats = await memberService.getGenerationStats();
        const generations = stats.map((s) => s.generation);

        return apiSuccess(
            {
                generations,
                stats,
            },
            undefined,
            200,
            { total: generations.length }
        );
    } catch (error) {
        console.error('Lỗi API GET /api/members/generations:', error);
        return apiError('Không thể lấy danh sách thế hệ từ máy chủ.');
    }
}

