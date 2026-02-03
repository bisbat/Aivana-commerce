export function getHalfMonthRange(now: Date) {
  const day = now.getDate();

  let start: Date;
  let end: Date;

  if (day === 1) {
    start = new Date(now.getFullYear(), now.getMonth() - 1, 16);
    end = new Date(now.getFullYear(), now.getMonth(), 0);
  } else {
    start = new Date(now.getFullYear(), now.getMonth(), 1);
    end = new Date(now.getFullYear(), now.getMonth(), 15);
  }

  return { start, end };
}
