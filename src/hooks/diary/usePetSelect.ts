import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchMyPets } from '@/services/pets';
import { useActivePetId } from '@/hooks/queries/useActivePetId';
import { useActivatePet } from '@/hooks/mutations/useActivatePet';
import type { SelectItem } from '@/types/select';
import type { Pet } from '@/types/pets';

type Value = string | number;

type Options = {
  enabled?: boolean; // 기본 true
  initialPetId?: number | null; // 수정 화면 등에서 초기값 주입
  autoActivateIfNone?: boolean; // activePetId가 없을 때 초기 선택값으로 자동 활성화 PATCH (기본 true)
};

export const usePetSelect = (opts: Options = {}) => {
  const { enabled = true, initialPetId = null, autoActivateIfNone = true } = opts;

  // 1) 내 반려동물 목록
  const petsQ = useQuery({
    queryKey: ['myPets'],
    queryFn: fetchMyPets,
    enabled,
    staleTime: 60_000,
  });

  // 2) 전역 활성 펫 id (AsyncStorage/Query 기반)
  const activeIdQ = useActivePetId();

  // 3) SelectBox 아이템
  const items: SelectItem[] = useMemo(() => {
    const list = petsQ.data ?? [];
    return list.map((p: Pet) => ({ label: p.name, value: p.id }));
  }, [petsQ.data]);

  // 4) UI 선택값
  const [values, setValues] = useState<Value[]>([]);

  // 5) 활성화 뮤테이션 (낙관적 업데이트 포함)
  const activate = useActivatePet();

  // 6) 초기 선택값 설정:
  //    - activePetId가 있으면 그 값을 사용
  //    - 없으면 initialPetId가 유효하면 그 값
  //    - 둘 다 없으면 첫 번째 펫
  //    - activePetId가 비어있을 때만 자동 활성화 PATCH로 서버와 동기화
  useEffect(() => {
    if (!enabled) return;
    if (petsQ.isLoading || activeIdQ.isLoading) return;

    if (!items.length) {
      setValues([]);
      return;
    }

    // 이미 선택된 값이 아이템에 존재하면 유지
    if (values.length > 0 && items.some((it) => it.value === values[0])) return;

    const activeId = activeIdQ.data;
    const hasActive = activeId != null && items.some((it) => it.value === activeId);

    let chosen: number | null = null;

    if (hasActive) {
      chosen = activeId as number;
    } else if (initialPetId != null && items.some((it) => it.value === initialPetId)) {
      chosen = initialPetId;
    } else {
      chosen = items[0].value as number;
    }

    setValues([chosen]);

    // 전역 active가 아직 없으면(최초 진입 등) 서버에도 반영
    if (autoActivateIfNone && activeId == null && chosen != null) {
      activate.mutate(chosen);
    }
  }, [
    enabled,
    petsQ.isLoading,
    activeIdQ.isLoading,
    items,
    initialPetId,
    activeIdQ.data,
    values,
    autoActivateIfNone,
    activate,
  ]);

  // 7) 선택 변경 → 즉시 활성화 PATCH
  const onChange = (next: Value[]) => {
    setValues(next);
    const nextId = next.length ? Number(next[0]) : null;
    if (nextId == null || activeIdQ.data === nextId) return;
    activate.mutate(nextId);
  };

  const loading = (enabled && (petsQ.isLoading || activeIdQ.isLoading)) || activate.isPending;
  const isError = petsQ.isError || activeIdQ.isError || activate.isError;

  return { items, values, onChange, loading, isError };
};
