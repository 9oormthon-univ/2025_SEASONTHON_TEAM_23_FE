export const EMOJIS = {
  best: { icon: 'IcSmiley', labelKo: '최고예요', emotion: '오늘은 최고의 하루예요.' },
  good: { icon: 'IcSmiley', labelKo: '좋아요', emotion: '오늘은 좋은 하루예요.' },
  soso: { icon: 'IcSmiley', labelKo: '평범해요', emotion: '오늘은 평범한 하루예요.' },
  sad: { icon: 'IcSad', labelKo: '슬퍼요', emotion: '오늘은 슬픈 하루였어요.' },
  bad: { icon: 'IcBad', labelKo: '별로예요', emotion: '오늘은 별로인 하루였어요.' },
} as const;
export type EmojiKey = keyof typeof EMOJIS;

export const ACTIVE_UI: Record<EmojiKey, { border: string; bg: string; icon: string }> = {
  best: {
    border: 'border-emoji-best',
    bg: 'bg-emoji-best/20',
    icon: '#A6EB7C',
  },
  good: {
    border: 'border-emoji-good',
    bg: 'bg-emoji-good/20',
    icon: '#8FC3F6',
  },
  soso: {
    border: 'border-emoji-soso',
    bg: 'bg-emoji-soso/20',
    icon: '#F3DE77',
  },
  sad: {
    border: 'border-emoji-sad',
    bg: 'bg-emoji-off',
    icon: '#CECECE',
  },
  bad: { border: 'border-emoji-bad', bg: 'bg-emoji-off', icon: 'white' },
};
