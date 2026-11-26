import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro, Noto_Serif, Geist_Mono } from "next/font/google";
import { cookies, headers } from "next/headers";
import { DeviceProvider } from "@/hooks/useDevice";
import { NavigationProvider } from "@/components/providers/NavigationProvider";
import { ClanProvider } from "@/components/providers/ClanProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { clanService } from "@/services/clanService";
import { parseDeviceFromUserAgent, type DeviceGroup, type DeviceType } from "@/utils/deviceDetector";
import { ServiceWorkerRegister } from "@/components/app/common/ServiceWorkerRegister";
import { SplashScreen } from "@/components/app/common/SplashScreen";
import { Toaster } from "@/components/ui/sonner";
import { CLAN_CONFIG } from "@/config/clanConfig";
import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-be-vietnam-pro",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const notoSerif = Noto_Serif({
  variable: "--font-noto-serif",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#5b030d",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: `${CLAN_CONFIG.name} • ${CLAN_CONFIG.slogan}`,
  description: "Trang tra cứu thông tin gia phả, thế hệ và vai vế dòng họ",
  applicationName: CLAN_CONFIG.systemName,
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: CLAN_CONFIG.systemName,
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const headerStore = await headers();

  const forcedGroup = cookieStore.get("forced_device_group")?.value as DeviceGroup | undefined;
  const cookieGroup = cookieStore.get("device_group")?.value as DeviceGroup | undefined;
  const cookieType = cookieStore.get("device_type")?.value as DeviceType | undefined;
  const headerGroup = headerStore.get("x-device-group") as DeviceGroup | undefined;
  const headerType = headerStore.get("x-device-type") as DeviceType | undefined;
  const userAgent = headerStore.get("user-agent");
  const parsedUA = parseDeviceFromUserAgent(userAgent);

  let initialGroup: DeviceGroup;
  let initialType: DeviceType;

  if (forcedGroup) {
    initialGroup = forcedGroup;
    initialType = cookieType || (forcedGroup === 'mobile' ? 'mobile' : 'desktop');
  } else if (parsedUA.isMobile || parsedUA.isTablet) {
    // Thiết bị di động / máy tính bảng thực tế: Luôn ưu tiên User-Agent
    initialGroup = 'mobile';
    initialType = parsedUA.deviceType;
  } else if (headerGroup) {
    initialGroup = headerGroup;
    initialType = headerType || (headerGroup === 'mobile' ? 'mobile' : 'desktop');
  } else if (cookieGroup) {
    initialGroup = cookieGroup;
    initialType = cookieType || (cookieGroup === 'mobile' ? 'mobile' : 'desktop');
  } else {
    initialGroup = parsedUA.deviceGroup || "desktop";
    initialType = parsedUA.deviceType || "desktop";
  }

  const initialClan = await clanService.getClanInfo();

  return (
    <html lang="vi" data-device-group={initialGroup} data-device-type={initialType} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var ua = navigator.userAgent || '';
                // 1. Nhận diện phần cứng thiết bị di động / máy tính bảng thực tế
                var isTouch = navigator.maxTouchPoints > 0;
                var isIPad = /iPad/i.test(ua) || (isTouch && (navigator.platform === 'MacIntel' || ua.indexOf('Macintosh') !== -1));
                var isAndroidTablet = /Android/i.test(ua) && ua.indexOf('Mobile') === -1;
                var width = window.innerWidth;
                var isTablet = isIPad || isAndroidTablet || (isTouch && width >= 600 && width <= 1366);
                var isPhone = !isTablet && (/Mobile|iP(hone|od)|Android.*Mobile/i.test(ua) || (isTouch && width < 600));
                var isRealTouchDevice = isTablet || isPhone;
                
                var group = 'desktop';
                var type = 'desktop';
                
                if (isRealTouchDevice) {
                  // ƯU TIÊN THIẾT BỊ CẢM ỨNG / TABLET THỰC (BAO GỒM TẤT CẢ IPAD NGANG DỌC)
                  group = 'mobile';
                  type = isTablet ? 'tablet' : 'mobile';
                } else {
                  // TRÊN MÁY TÍNH (PC / LAPTOP): KIỂM TRA THEO KÍCH THƯỚC MÀN HÌNH (VIEWPORT)
                  if (width < 768) {
                    group = 'mobile';
                    type = 'mobile';
                  } else if (width < 1280) {
                    group = 'mobile';
                    type = 'tablet';
                  } else {
                    group = 'desktop';
                    type = 'desktop';
                  }
                }
                
                document.documentElement.setAttribute('data-device-group', group);
                document.documentElement.setAttribute('data-device-type', type);
                
                // Đồng bộ cookie nếu chưa có forced
                if (document.cookie.indexOf('forced_device_group=') === -1) {
                  document.cookie = 'device_group=' + group + '; path=/; max-age=2592000; SameSite=Lax';
                  document.cookie = 'device_type=' + type + '; path=/; max-age=2592000; SameSite=Lax';
                }

                // Tự động dọn dẹp các element do browser extension chèn trước khi React hydrate
                var observer = new MutationObserver(function(mutations) {
                  var bubble = document.getElementById('definer-bubble-host');
                  if (bubble && bubble.parentNode) {
                    bubble.parentNode.removeChild(bubble);
                  }
                });
                if (document.documentElement) {
                  observer.observe(document.documentElement, { childList: true, subtree: true });
                }
                window.addEventListener('DOMContentLoaded', function() {
                  setTimeout(function() { observer.disconnect(); }, 2000);
                });
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body
        className={`${beVietnamPro.variable} ${notoSerif.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <SplashScreen />
        <ServiceWorkerRegister />
        <Toaster />
        <DeviceProvider initialGroup={initialGroup} initialType={initialType}>
          <ClanProvider initialClan={initialClan}>
            <AuthProvider>
              <NavigationProvider>
                {children}
              </NavigationProvider>
            </AuthProvider>
          </ClanProvider>
        </DeviceProvider>
      </body>
    </html>
  );
}

