import { NextResponse, type NextRequest } from 'next/server';
import { parseDeviceFromUserAgent, type DeviceGroup, type DeviceType } from '@/utils/deviceDetector';

export function proxy(request: NextRequest) {
    // 1. Kiểm tra cookie cưỡng chế hoặc cookie đã được đồng bộ từ client
    const forcedGroup = request.cookies.get('forced_device_group')?.value as DeviceGroup | undefined;
    const cookieGroup = request.cookies.get('device_group')?.value as DeviceGroup | undefined;
    const cookieType = request.cookies.get('device_type')?.value as DeviceType | undefined;

    // 2. Phân tích User-Agent
    const userAgentString = request.headers.get('user-agent') || '';
    const parsed = parseDeviceFromUserAgent(userAgentString);

    // 3. Quyết định deviceGroup & deviceType:
    // NGUYÊN TẮC: ƯU TIÊN USER-AGENT CHO THIẾT BỊ DI ĐỘNG/TABLET THỰC TẾ
    // CHO PHÉP COOKIE TỪ CLIENT KHI SỬ DỤNG MÁY TÍNH (ĐỂ TEST SIZE ĐIỆN THOẠI & TABLET TRÊN PC)
    let deviceGroup: DeviceGroup;
    let deviceType: DeviceType;

    if (forcedGroup) {
        deviceGroup = forcedGroup;
        deviceType = cookieType || (forcedGroup === 'mobile' ? 'mobile' : 'desktop');
    } else if (parsed.isMobile || parsed.isTablet) {
        // Thiết bị di động hoặc máy tính bảng thực tế: Luôn ưu tiên User-Agent
        deviceGroup = 'mobile';
        deviceType = parsed.deviceType;
    } else if (cookieGroup) {
        // Máy tính để bàn (PC), nhưng client có cookie (do developer test kích thước responsive trên máy tính)
        deviceGroup = cookieGroup;
        deviceType = cookieType || (cookieGroup === 'mobile' ? 'mobile' : 'desktop');
    } else {
        deviceGroup = parsed.deviceGroup;
        deviceType = parsed.deviceType;
    }

    // Thiết lập request headers để Server Components (RootLayout) có thể đọc ngay trong headers()
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-device-type', deviceType);
    requestHeaders.set('x-device-group', deviceGroup);

    const response = NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });

    response.headers.set('x-device-type', deviceType);
    response.headers.set('x-device-group', deviceGroup);

    // Lưu cookie nếu chưa có để các request sau đồng bộ ngay
    if (!cookieGroup && !forcedGroup) {
        response.cookies.set('device_group', deviceGroup, {
            path: '/',
            maxAge: 60 * 60 * 24 * 30, // 30 ngày
            sameSite: 'lax',
        });
        response.cookies.set('device_type', deviceType, {
            path: '/',
            maxAge: 60 * 60 * 24 * 30,
            sameSite: 'lax',
        });
    }

    return response;
}

export const config = {
    matcher: [
        /*
         * Áp dụng cho tất cả request routes, loại trừ:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder files
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
