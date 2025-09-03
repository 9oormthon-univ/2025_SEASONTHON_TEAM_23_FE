// format relative time (Korean): 방금 전, N분 전, N시간 전, N일 전
export const formatRelativeTime = (iso?: string | null) => {
  if (!iso) return '';
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '';
  const now = Date.now();
  const deltaSeconds = Math.max(0, Math.floor((now - then) / 1000));
  const minutes = Math.floor(deltaSeconds / 60);
  if (minutes < 1) return '방금 전';
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  return `${days}일 전`;
};
