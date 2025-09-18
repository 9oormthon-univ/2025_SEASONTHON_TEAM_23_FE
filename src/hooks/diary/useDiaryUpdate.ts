// src/hooks/diary/useDiaryUpdate.ts
import { useCallback } from 'react';
import { Alert } from 'react-native';
import { useUpdateDailyLog } from '@/hooks/mutations/useUpdateDailyLog';
import { useToast } from '@/provider/ToastProvider';
import { emojiKeyToMood } from '@/utils/calendar/mood';
import type { EmojiKey } from '@/constants/diary/emoji';

type UseDiaryUpdateOptions = {
  userId?: number;
  logId: number;
  selectedEmoji: EmojiKey | null;
  content: string;
  needAiReflection: boolean;
  onSuccess?: () => void;
};

export const useDiaryUpdate = ({
  userId,
  logId,
  selectedEmoji,
  content,
  needAiReflection,
  onSuccess,
}: UseDiaryUpdateOptions) => {
  const { mutateAsync, isPending } = useUpdateDailyLog();
  const { showToast } = useToast();

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

      await mutateAsync({
        logId,
        userId,
        body: {
          mood: emojiKeyToMood(selectedEmoji),
          content: trimmed,
          needAiReflection,
        },
      });

      showToast('일기가 수정되었어요 .', 'info');
      onSuccess?.();
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ??
        e?.message ??
        '일기 수정에 실패했어요. 잠시 후 다시 시도해 주세요.';
      Alert.alert('오류', msg);
    }
  }, [userId, logId, selectedEmoji, content, needAiReflection, mutateAsync, onSuccess, showToast]);

  return { submit, isSubmitting: isPending };
};
