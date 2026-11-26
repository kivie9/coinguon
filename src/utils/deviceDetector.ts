import { UAParser } from 'ua-parser-js';

export type DeviceType = 'mobile' | 'tablet' | 'desktop';
export type DeviceGroup = 'mobile' | 'desktop'; // 'mobile' = Smartphone & Tablet; 'desktop' = PC, Laptop

export interface DeviceInfo {
    deviceType: DeviceType;
    deviceGroup: DeviceGroup;
    isMobile: boolean; // True khi là điện thoại (phone)
    isTablet: boolean; // True khi là tablet (iPad, Android Tablet, hoặc test size tablet trên PC)
    isDesktop: boolean; // True khi là PC / Laptop kích thước lớn
    isPhone?: boolean; // Tương đương isMobile
    isTouch?: boolean; // True khi là màn hình cảm ứng hoặc thiết bị thực tế
    isIOS?: boolean;
    isAndroid?: boolean;
    isIPad?: boolean;
    osName?: string;
    browserName?: string;
    width?: number;
}

/**
 * Phân tích thiết bị từ User-Agent trực tiếp bằng thư viện ua-parser-js
 */
export function parseDeviceFromUserAgent(ua?: string | null): DeviceInfo {
    const userAgent = ua || '';
    const parser = new UAParser(userAgent || undefined);
    const os = parser.getOS();
    const browser = parser.getBrowser();
    const type = parser.getDevice().type;

    // 1. Nhận diện iPad & Tablet qua User-Agent
    const isIPadUA = /iPad/i.test(userAgent);
    const isAndroidTabletUA = /Android/i.test(userAgent) && !/Mobile/i.test(userAgent);
    const isTabletUA =
        isIPadUA ||
        isAndroidTabletUA ||
        type === 'tablet' ||
        /Tablet|PlayBook|Silk/i.test(userAgent);

    // 2. Nhận diện Smartphone / Mobile qua User-Agent
    const isIOS = os.name === 'iOS' || isIPadUA;
    const isAndroid = os.name === 'Android';
    const isMobileUA =
        type === 'mobile' ||
        (!isTabletUA && (isIOS || isAndroid)) ||
        /Mobile|iP(hone|od)|Android.*Mobile|BlackBerry|IEMobile|Kindle/i.test(userAgent);

    const deviceType: DeviceType = isTabletUA ? 'tablet' : isMobileUA ? 'mobile' : 'desktop';
    const isMobileGroup = isTabletUA || isMobileUA;
    const deviceGroup: DeviceGroup = isMobileGroup ? 'mobile' : 'desktop';

    return {
        deviceType,
        deviceGroup,
        isMobile: isMobileUA,
        isPhone: isMobileUA,
        isTablet: isTabletUA,
        isDesktop: !isMobileGroup,
        isTouch: isMobileGroup,
        isIOS,
        isAndroid,
        isIPad: isIPadUA,
        osName: os.name,
        browserName: browser.name,
    };
}

/**
 * Lấy cookie trên trình duyệt theo tên
 */
function getClientCookie(name: string): string | null {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
    return match ? decodeURIComponent(match[3]) : null;
}

/**
 * Đồng bộ cookie device_group & device_type để các lượt tải trang / SSR tiếp theo nhất quán
 */
export function syncDeviceCookie(group: DeviceGroup, type?: DeviceType) {
    if (typeof document !== 'undefined') {
        try {
            document.cookie = `device_group=${group}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
            if (type) {
                document.cookie = `device_type=${type}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
            }
        } catch {
            // Không chặn ứng dụng nếu cookie bị chặn
        }
    }
}

/**
 * Lấy thông tin thiết bị trên Client:
 * 1. ƯU TIÊN USER-AGENT CHO THIẾT BỊ DI ĐỘNG/TABLET THỰC TẾ (iPad, iPhone, Android).
 * 2. KIỂM TRA SIZE CHO MÁY TÍNH (PC/Laptop) KHI TEST KÍCH THƯỚC ĐIỆN THOẠI & TABLET.
 */
export function getClientDeviceInfo(): DeviceInfo {
    if (typeof window === 'undefined') {
        return parseDeviceFromUserAgent();
    }

    // 0. Ưu tiên cookie cưỡng chế (forced_device_group) nếu người dùng đã chủ động chọn
    const forced = getClientCookie('forced_device_group');
    if (forced === 'mobile' || forced === 'desktop') {
        const info = parseDeviceFromUserAgent(navigator.userAgent);
        const forcedType: DeviceType = forced === 'mobile' ? 'mobile' : 'desktop';
        return {
            ...info,
            deviceType: forcedType,
            deviceGroup: forced,
            isMobile: forced === 'mobile',
            isPhone: forced === 'mobile',
            isTablet: false,
            isDesktop: forced === 'desktop',
            width: window.innerWidth,
        };
    }

    const ua = navigator.userAgent || '';
    const info = parseDeviceFromUserAgent(ua);
    const width = window.innerWidth;

    // 1. Phát hiện iPad trên iPadOS (kể cả khi Safari bật chế độ Request Desktop Website giả lập Mac OS X)
    // Đặc trưng chuẩn Apple iPadOS & thiết bị cảm ứng máy tính bảng:
    // - navigator.maxTouchPoints > 0 (máy tính thông thường không có cảm ứng đa điểm)
    // - User-Agent chứa 'iPad', hoặc 'Macintosh'/'MacIntel' (iPadOS giả lập Mac)
    const isTouch = typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0;
    const isIPad =
        /iPad/i.test(ua) ||
        (isTouch && (navigator.platform === 'MacIntel' || ua.includes('Macintosh')));

    // 2. Phát hiện Android Tablet
    const isAndroidTablet = /Android/i.test(ua) && !/Mobile/i.test(ua);
    
    // Mọi thiết bị tablet thực tế hoặc thiết bị cảm ứng có bề ngang màn hình máy tính bảng (600px - 1366px)
    // Bao gồm: iPad Mini, iPad Gen 9/10, iPad Air, iPad Pro 11", iPad Pro 12.9" ở cả chiều dọc lẫn chiều xoay ngang
    const isRealTablet = isIPad || isAndroidTablet || info.isTablet || (isTouch && width >= 600 && width <= 1366);

    // 3. Phát hiện điện thoại di động thực tế qua User-Agent
    const isRealPhone =
        info.isMobile ||
        (!isRealTablet && isTouch && width < 600) ||
        /Mobile|iP(hone|od)|Android.*Mobile|BlackBerry|IEMobile|Kindle/i.test(ua);

    // === NGUYÊN TẮC 1: ƯU TIÊN USER-AGENT & CẢM ỨNG CHO THIẾT BỊ THỰC ===
    // Nếu là iPad hoặc Máy tính bảng thực tế -> Luôn giữ nhận diện là Tablet
    if (isRealTablet) {
        syncDeviceCookie('mobile', 'tablet');
        return {
            ...info,
            deviceType: 'tablet',
            deviceGroup: 'mobile',
            isMobile: false,
            isPhone: false,
            isTablet: true,
            isDesktop: false,
            isTouch: true,
            isIOS: isIPad || info.isIOS,
            isIPad,
            width,
        };
    }

    // Nếu là điện thoại Smartphone thực tế qua User-Agent -> Luôn giữ nhận diện là Mobile (Phone)
    if (isRealPhone) {
        syncDeviceCookie('mobile', 'mobile');
        return {
            ...info,
            deviceType: 'mobile',
            deviceGroup: 'mobile',
            isMobile: true,
            isPhone: true,
            isTablet: false,
            isDesktop: false,
            isTouch: true,
            width,
        };
    }

    // === NGUYÊN TẮC 2: KIỂM TRA SIZE KHI SỬ DỤNG TRÊN MÁY TÍNH (PC / LAPTOP) ===
    // Khi người dùng dùng máy tính nhưng co nhỏ cửa sổ hoặc bật DevTools test kích thước:
    // - width < 768px: Hiển thị giao diện Điện thoại (Mobile)
    // - 768px <= width < 1280px: Hiển thị giao diện Máy tính bảng (Tablet) (đáp ứng mọi iPad/máy tính bảng ngang dọc)
    // - width >= 1280px: Hiển thị giao diện Máy tính để bàn lớn (Desktop)
    if (width < 768) {
        syncDeviceCookie('mobile', 'mobile');
        return {
            ...info,
            deviceType: 'mobile',
            deviceGroup: 'mobile',
            isMobile: true,
            isPhone: true,
            isTablet: false,
            isDesktop: false,
            isTouch: false,
            width,
        };
    }

    if (width < 1280) {
        syncDeviceCookie('mobile', 'tablet');
        return {
            ...info,
            deviceType: 'tablet',
            deviceGroup: 'mobile',
            isMobile: false,
            isPhone: false,
            isTablet: true,
            isDesktop: false,
            isTouch: isTouch,
            isIPad: isIPad,
            width,
        };
    }

    // Máy tính màn hình rộng >= 1280px
    syncDeviceCookie('desktop', 'desktop');
    return {
        ...info,
        deviceType: 'desktop',
        deviceGroup: 'desktop',
        isMobile: false,
        isPhone: false,
        isTablet: false,
        isDesktop: true,
        isTouch: false,
        width,
    };
}
