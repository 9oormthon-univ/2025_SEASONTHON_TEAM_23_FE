export type SelectItem = {
  label: string;
  value: string | number;
};

export type PersonalityValue =
  | 'cowardly' // 겁쟁이
  | 'troublemaker' // 사고뭉치
  | 'shy' // 낯가리는
  | 'affectionate' // 애교쟁이
  | 'lively' // 발랄한
  | 'greedy' // 욕심쟁이
  | 'elegant' // 우아한
  | 'disobedient' // 말 안 듣는
  | 'quirky' // 엉뚱한
  | 'quiet' // 조용한
  | 'gentle' // 얌전한
  | 'smart' // 똑똑한
  | 'obedient' // 말 잘 듣는
  | 'assertive' // 성격있는
  | 'cute' // 귀여운
  | 'cheerful' // 잘 웃는
  | 'social' // 사회성 좋은
  | 'neat'; // 깔끔한

export const PERSONALITY_OPTIONS: { label: string; value: PersonalityValue }[] = [
  { label: '겁쟁이', value: 'cowardly' },
  { label: '사고뭉치', value: 'troublemaker' },
  { label: '낯가리는', value: 'shy' },
  { label: '애교쟁이', value: 'affectionate' },
  { label: '발랄한', value: 'lively' },
  { label: '욕심쟁이', value: 'greedy' },
  { label: '우아한', value: 'elegant' },
  { label: '말 안 듣는', value: 'disobedient' },
  { label: '엉뚱한', value: 'quirky' },
  { label: '조용한', value: 'quiet' },
  { label: '얌전한', value: 'gentle' },
  { label: '똑똑한', value: 'smart' },
  { label: '말 잘 듣는', value: 'obedient' },
  { label: '성격있는', value: 'assertive' },
  { label: '귀여운', value: 'cute' },
  { label: '잘 웃는', value: 'cheerful' },
  { label: '사회성 좋은', value: 'social' },
  { label: '깔끔한', value: 'neat' },
];

export const PERSONALITY_CONFLICTS: Partial<Record<PersonalityValue, PersonalityValue[]>> = {
  lively: ['quiet'],
  quiet: ['lively'],

  gentle: ['troublemaker', 'disobedient'],
  troublemaker: ['gentle'],

  disobedient: ['obedient', 'gentle'],
  obedient: ['disobedient'],

  shy: ['social'],
  social: ['shy'],
};

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
