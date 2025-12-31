const toDate = (value: string): Date => {
  if (!value.includes("T")) {
    return new Date(value.replace(" ", "T") + "Z");
  }
  return new Date(value);
};

export const formatTime = (dateString: string): string => {
  try {
    const utcDate = toDate(dateString);

    return utcDate.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    });
  } catch {
    return "";
  }
};
