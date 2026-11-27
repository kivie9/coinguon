import { LineageEventDto } from '@/services/api/eventApi';

function parseEventDate(ev: LineageEventDto): Date {
    if (ev.targetDate && /^\d{4}-\d{2}-\d{2}$/.test(ev.targetDate)) {
        const d = new Date(`${ev.targetDate}T08:00:00`);
        if (!isNaN(d.getTime())) return d;
    }
    if (ev.dateSolar && /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(ev.dateSolar)) {
        const [day, month, year] = ev.dateSolar.split('/').map(Number);
        const d = new Date(year, month - 1, day, 8, 0, 0);
        if (!isNaN(d.getTime())) return d;
    }
    const fallback = new Date();
    fallback.setDate(fallback.getDate() + 1);
    fallback.setHours(8, 0, 0, 0);
    return fallback;
}

function formatIcsDate(d: Date): string {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
}

function escapeIcsText(text: string): string {
    return text.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
}

/**
 * Tạo và tải file lịch .ics (hỗ trợ Google Calendar, Apple Calendar trên điện thoại & máy tính)
 * kèm nhắc nhở trước 1 ngày.
 */
export function downloadEventIcs(ev: LineageEventDto): void {
    const start = parseEventDate(ev);
    const end = new Date(start.getTime() + 3 * 60 * 60 * 1000);
    const uid = `giapha-event-${ev.id}-${Date.now()}@giapha.local`;

    const descParts = [
        ev.dateLunar ? `Ngày Âm lịch: ${ev.dateLunar}` : '',
        ev.role ? `Đối tượng: ${ev.role}` : '',
        ev.description || '',
    ].filter(Boolean);

    const lines = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Gia Pha So//Lich Te Tu//VI',
        'CALSCALE:GREGORIAN',
        'BEGIN:VEVENT',
        `UID:${uid}`,
        `DTSTAMP:${formatIcsDate(new Date())}`,
        `DTSTART:${formatIcsDate(start)}`,
        `DTEND:${formatIcsDate(end)}`,
        `SUMMARY:${escapeIcsText(ev.title)}`,
        `LOCATION:${escapeIcsText(ev.location || 'Từ đường Gia tộc')}`,
        `DESCRIPTION:${escapeIcsText(descParts.join(' | '))}`,
        'BEGIN:VALARM',
        'TRIGGER:-P1D',
        'ACTION:DISPLAY',
        `DESCRIPTION:Nhắc nhở trước 1 ngày: ${escapeIcsText(ev.title)}`,
        'END:VALARM',
        'END:VEVENT',
        'END:VCALENDAR',
    ];

    const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lich-gio-${ev.id}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
