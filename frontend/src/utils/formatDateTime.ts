export const formatDateTime = (dateString: string): string => {
  try {
    const utcDate = new Date(dateString.replace(" ", "T") + "Z");

    const istNow = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );

    const istDate = new Date(
      utcDate.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );

    const isToday =
      istDate.getFullYear() === istNow.getFullYear() &&
      istDate.getMonth() === istNow.getMonth() &&
      istDate.getDate() === istNow.getDate();

    if (isToday) {
      return `Today, ${istDate.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })}`;
    }

    return istDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
};
