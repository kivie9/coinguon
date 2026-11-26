import { NextResponse } from 'next/server';

export interface ApiResponseOptions {
    headers?: Record<string, string>;
}

/**
 * Phản hồi thành công chuẩn cho API Route
 */
export function apiSuccess<T>(data: T, message?: string, status = 200, extra?: Record<string, unknown>) {
    return NextResponse.json(
        {
            success: true,
            data,
            ...(message ? { message } : {}),
            ...(extra || {}),
        },
        { status }
    );
}

/**
 * Phản hồi lỗi chuẩn cho API Route
 */
export function apiError(message: string, status = 500, extra?: Record<string, unknown>) {
    return NextResponse.json(
        {
            success: false,
            message,
            ...(extra || {}),
        },
        { status }
    );
}

export function apiBadRequest(message: string) {
    return apiError(message, 400);
}

export function apiUnauthorized(message = 'Chưa đăng nhập hoặc phiên đã hết hạn.') {
    return apiError(message, 401);
}

export function apiForbidden(message = 'Bạn không có quyền thực hiện thao tác này.') {
    return apiError(message, 403);
}

export function apiNotFound(message: string) {
    return apiError(message, 404);
}

