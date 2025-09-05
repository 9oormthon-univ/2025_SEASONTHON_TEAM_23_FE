export const keepAllKorean = (s: string) =>
  s
    .split('\n')
    .map((line) =>
      line
        .split(/(\s+)/)
        .map((seg) => (/^\s+$/.test(seg) ? seg : seg.split('').join('\u2060')))
        .join('')
    )
    .join('\n');

export const keepAllButAllowAfterPunct = (s: string) =>
  keepAllKorean(s).replace(/([,.;!?…])/g, '$1\u200B');
