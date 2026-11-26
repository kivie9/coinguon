/**
 * Rung phản hồi xúc giác (Haptic Feedback) cho điện thoại di động
 * Giúp người dùng (đặc biệt là người lớn tuổi) nhận biết rõ thao tác bấm
 */
export function triggerHaptic(type: 'light' | 'medium' | 'heavy' | 'selection' = 'light') {
  if (typeof window === 'undefined' || !('vibrate' in navigator)) {
    return;
  }

  try {
    switch (type) {
      case 'selection':
      case 'light':
        navigator.vibrate(12); // Rung ngắn 12ms
        break;
      case 'medium':
        navigator.vibrate(25); // Rung vừa 25ms
        break;
      case 'heavy':
        navigator.vibrate([30, 20, 40]); // Nhịp rung mạnh
        break;
    }
  } catch {
    // Trình duyệt không cho phép rung
  }
}

