import { useCallback } from 'react';
import { Alert } from 'react-native';
import { useCreateDailyLog } from '@/hooks/mutations/useCreateDailyLog';
import { emojiKeyToMood } from '@/utils/calendar/mood';
import type { EmojiKey } from '@/constants/diary/emoji';
import { localISODate, todayISO } from '@/utils/calendar/date';

type UseDiarySubmitOptions = {
  userId?: number;
  selectedEmoji: EmojiKey | null;
  content: string;
  needAiReflection: boolean;
  onSuccess?: (logId: number) => void;
};

export const useDiarySubmit = ({
  userId,
  selectedEmoji,
  content,
  needAiReflection,
  onSuccess,
}: UseDiarySubmitOptions) => {
  const { mutateAsync, isPending } = useCreateDailyLog(Number(userId));

  const submit = useCallback(async () => {
    try {
      if (!userId) {
        Alert.alert('알림', '로그인이 필요합니다.');
        return;
      }
      const trimmed = content.trim();
      if (!trimmed) {
        Alert.alert('알림', '내용을 입력해 주세요.');
        return;
      }
      if (!selectedEmoji) {
        Alert.alert('알림', '오늘의 기분을 선택해 주세요.');
        return;
      }

      const res = await mutateAsync({
        logDate: localISODate(todayISO()),
        mood: emojiKeyToMood(selectedEmoji),
        content: trimmed,
        needAiReflection,
      });

      if (res?.id != null) {
        onSuccess?.(res.id);
      }

      Alert.alert('완료', '일기가 저장되었습니다.');
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ??
        e?.message ??
        '일기 저장에 실패했어요. 잠시 후 다시 시도해 주세요.';
      Alert.alert('오류', msg);
    }
  }, [userId, selectedEmoji, content, needAiReflection, mutateAsync, onSuccess]);

  return { submit, isSubmitting: isPending };
};
