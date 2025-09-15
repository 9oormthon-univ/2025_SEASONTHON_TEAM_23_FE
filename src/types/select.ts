type PersonalityValue =
  | 'prickly' // 까칠함
  | 'active' // 활발함
  | 'calm' // 차분함
  | 'loyal' // 충성심이 강함
  | 'smart' // 똑똑함
  | 'friendly' // 친근함
  | 'aggressive' // 사나움
  | 'gentle'; // 순함

export const PERSONALITY_OPTIONS: { label: string; value: PersonalityValue }[] = [
  { label: '까칠함', value: 'prickly' },
  { label: '활발함', value: 'active' },
  { label: '차분함', value: 'calm' },
  { label: '충성심이 강함', value: 'loyal' },
  { label: '똑똑함', value: 'smart' },
  { label: '친근함', value: 'friendly' },
  { label: '사나움', value: 'aggressive' },
  { label: '순함', value: 'gentle' },
];

type SpeciesValue =
  | 'dog'
  | 'cat'
  | 'hamster'
  | 'rabbit'
  | 'guineaPig'
  | 'Hedgehog'
  | 'parrot'
  | 'fish'
  | 'turtle'
  | 'lizard';

export const SPECIES_OPTIONS: { label: string; value: SpeciesValue }[] = [
  { label: '강아지', value: 'dog' },
  { label: '고양이', value: 'cat' },
  { label: '햄스터', value: 'hamster' },
  { label: '토끼', value: 'rabbit' },
  { label: '기니피그', value: 'guineaPig' },
  { label: '고슴도치', value: 'Hedgehog' },
  { label: '앵무새', value: 'parrot' },
  { label: '물고기', value: 'fish' },
  { label: '거북이', value: 'turtle' },
  { label: '도마뱀', value: 'lizard' },
];
