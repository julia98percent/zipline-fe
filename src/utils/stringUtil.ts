export function translateNotificationCategory(category: string): string {
  const categoryMap: Record<string, string> = {
    NEW_SURVEY: "신규 설문",
    BIRTHDAY_MSG: "문자 발송",
    CONTRACT_EXPIRED_MSG: "문자 발송",
    SCHEDULE: "일정",
  };

  return categoryMap[category] ?? "알림";
}
