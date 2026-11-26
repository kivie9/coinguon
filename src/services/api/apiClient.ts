/**
 * Trình gọi API thống nhất cho toàn ứng dụng.
 * Phiên Auth.js v5 tự động đi kèm qua HTTP-only cookie cùng domain;
 * tự đính kèm header x-demo-role nếu người dùng bật chế độ trải nghiệm vai trò.
 */
export async function apiFetch(input: string | URL | Request, init?: RequestInit): Promise<Response> {
    const headers = new Headers(init?.headers);

    if (typeof window !== 'undefined') {
        try {
            const demoRole = localStorage.getItem('coinguon_demo_role');
            if (demoRole) {
                headers.set('x-demo-role', demoRole);
            }
        } catch {
            // Bỏ qua lỗi đọc localStorage
        }
    }

    return fetch(input, {
        credentials: 'same-origin',
        ...init,
        headers,
    });
}
