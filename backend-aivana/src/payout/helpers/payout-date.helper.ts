export function getHalfMonthRange(now: Date) {
  const bangkokOffset = 7 * 60; // minutes

  // Convert now to Bangkok time manually
  const bangkokNow = new Date(now.getTime() + bangkokOffset * 60 * 1000);

  const year = bangkokNow.getUTCFullYear();
  const month = bangkokNow.getUTCMonth();
  const day = bangkokNow.getUTCDate();

  let startBangkok: Date;
  let endBangkok: Date;

  if (day === 1) {
    // 16 → End of previous month
    startBangkok = new Date(Date.UTC(year, month - 1, 16, 0, 0, 0));
    endBangkok = new Date(Date.UTC(year, month, 1, 0, 0, 0)); // exclusive
  } else {
    // 1 → 16
    startBangkok = new Date(Date.UTC(year, month, 1, 0, 0, 0));
    endBangkok = new Date(Date.UTC(year, month, 16, 0, 0, 0)); // exclusive
  }

  // Convert Bangkok midnight to UTC by subtracting 7 hours
  const startUTC = new Date(startBangkok.getTime() - bangkokOffset * 60 * 1000);
  const endUTC = new Date(endBangkok.getTime() - bangkokOffset * 60 * 1000);

  return { start: startUTC, end: endUTC };
}
