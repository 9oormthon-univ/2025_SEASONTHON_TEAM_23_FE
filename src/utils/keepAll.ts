// src/utils/text/keepAll.ts
// 단어(공백으로 구분되는 토큰) 내부에 줄바꿈 금지 문자(WORD JOINER, U+2060)를 삽입
export const keepAllKorean = (s: string) =>
  s
    .split(/\s+/) // 공백 기준으로 토큰 분리
    .map((tok) => tok.split('').join('\u2060'))
    .join(' ');

export const keepAllButAllowAfterPunct = (s: string) =>
  keepAllKorean(s).replace(/([,.;!?…])/g, '$1\u200B');
