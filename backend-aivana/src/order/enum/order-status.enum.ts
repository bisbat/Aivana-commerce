export enum OrderStatusEnum {
  PENDING = 'PENDING',        // สร้าง order แล้ว ยังไม่จ่าย
  PAID = 'PAID',              // จ่ายเงินสำเร็จ
  CANCELLED = 'CANCELLED',    // user ยกเลิก
  FAILED = 'FAILED',          // payment fail แบบ recover ไม่ได้
}
