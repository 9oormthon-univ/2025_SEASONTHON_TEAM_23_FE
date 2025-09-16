import { useEffect, useMemo, useState } from 'react';
import { useMyPets } from '@/hooks/queries/useMyPets';
import type { Pet } from '@/types/pets';
import type { SelectItem } from '@/types/select';

type Options = {
  enabled?: boolean; // 기본 true
  initialPetId?: number | null; // 수정 화면에서 기존 선택값
};

export const usePetSelect = (opts: Options = {}) => {
  const { enabled = true, initialPetId = null } = opts;
  const { pets, loading, error, refetch } = useMyPets(enabled);

  const items: SelectItem[] = useMemo(
    () => (pets ?? []).map((p: Pet) => ({ label: p.name, value: p.id })), // label: name, value: id
    [pets]
  );

  // SelectBox는 배열 형식(values)을 받으므로 단일 선택도 배열 1칸 유지
  const [values, setValues] = useState<number[]>([]);

  // 초기 선택: initialPetId가 있으면 그걸, 없으면 첫 번째 펫 자동 선택
  useEffect(() => {
    if (loading) return;
    if (!items.length) {
      setValues([]); // 펫 없으면 비워두기(상위에서 게이트/로딩 처리)
      return;
    }

    // 이미 선택되어 있으면 유지
    if (values.length > 0 && items.some((it) => it.value === values[0])) return;

    // 초기값 우선
    if (initialPetId != null && items.some((it) => it.value === initialPetId)) {
      setValues([initialPetId]);
      return;
    }

    // 없으면 첫 번째 자동 선택
    setValues([items[0].value as number]);
  }, [loading, items, initialPetId]);

  // SelectBox onChange에 바로 넣기엔 타입 충돌 날 수 있으니 래퍼 제공
  const onChange = (next: (string | number)[]) => {
    // value는 number로 유지
    const n = Number(next[0]);
    setValues(Number.isFinite(n) ? [n] : []);
  };

  const selectedPetId = values.length ? values[0] : null;

  return {
    items,
    values, // number[]
    setValues, // 필요시 직접 설정 가능
    onChange, // <SelectBox onChange={onChange} />
    selectedPetId, // 폼 제출 시 사용
    loading,
    isError: !!error,
    error,
    refetch,
  };
};
