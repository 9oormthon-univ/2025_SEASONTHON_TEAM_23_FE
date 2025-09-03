/** mood 번호 → 원형 배경색(hex) */
export const moodColorFromNumber = (mood?: number): string | undefined => {
  // 예시 매핑: 0=best, 1=good, 2=soso, 3=sad, 4=bad
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
