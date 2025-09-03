import type { EmojiKey } from '@/constants/diary/emoji';

export const moodColorFromNumber = (mood?: number): string | undefined => {
  switch (mood) {
    case 0:
      return '#A6EB7C'; // best
    case 1:
      return '#8FC3F6'; // good
    case 2:
      return '#F3DE77'; // soso
    case 3:
      return '#CECECE'; // sad
    case 4:
      return '#F5F5F5'; // bad(연한 회색)
    default:
      return undefined;
  }
};

export const emojiKeyToMood = (key: EmojiKey): number => {
  switch (key) {
    case 'best':
      return 0;
    case 'good':
      return 1;
    case 'soso':
      return 2;
    case 'sad':
      return 3;
    case 'bad':
      return 4;
  }
};
