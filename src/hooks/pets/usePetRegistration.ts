import { useCallback, useEffect, useMemo, useState } from 'react';
import { buildCreatePetPayload } from '@/utils/payload';
import { useToast } from '@/provider/ToastProvider';
import type { Pet } from '@/types/pets';
import { createPet, updatePet } from '@/services/pets';

// 화면에서 SelectBox가 string | number를 줄 수 있으니 타입 유연하게
type Value = string | number;

type UsePetRegistrationOptions = {
  onSuccessNav?: () => void;
  initialPet?: Pet | null;
  debug?: boolean; // 디버깅 로그 강제 on/off (기본: __DEV__)
};

{
  /*디버깅 코드*/
}
type LastRequest =
  | { mode: 'create'; payload: { name: string; species: string; personalities: string[] } }
  | {
      mode: 'update';
      id: number;
      body: { name: string; breed: string; personality: string };
    };

export const usePetRegistration = (opts: UsePetRegistrationOptions = {}) => {
  const { onSuccessNav, initialPet, debug = __DEV__ } = opts;
  const { showToast } = useToast();

  const log = (...args: any[]) => {
    if (debug) console.log('[usePetRegistration]', ...args);
  };
  const logErr = (...args: any[]) => {
    if (debug) console.error('[usePetRegistration:ERROR]', ...args);
  };
  // 디버깅용 상태: 마지막 요청/에러
  const [lastRequest, setLastRequest] = useState<LastRequest | null>(null);
  const [lastError, setLastError] = useState<{
    message: string;
    status?: number;
    data?: any;
    raw?: any;
  } | null>(null);

  const extractError = (e: any) => {
    const status = e?.response?.status;
    const data = e?.response?.data;
    const message =
      data?.message ||
      e?.message ||
      (typeof data === 'string' ? data : 'Unknown error (no message)');
    return { message, status, data, raw: e };
  };

  const [petName, setPetName] = useState(initialPet?.name ?? '');
  const [selectSpecies, setSelectSpecies] = useState<string[]>(
    initialPet?.breed ? [String(initialPet.breed)] : []
  );
  const [selectPersonality, setSelectPersonality] = useState<string[]>(
    initialPet?.personality
      ? String(initialPet.personality)
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      : []
  );

  // 초기값이 바뀌는 경우 대응
  useEffect(() => {
    if (!initialPet) return;
    setPetName(initialPet.name ?? '');
    setSelectSpecies(initialPet.breed ? [String(initialPet.breed)] : []);
    setSelectPersonality(
      initialPet.personality
        ? String(initialPet.personality)
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
        : []
    );
  }, [initialPet?.id]);

  // 검증
  const canSubmit = useMemo(
    () => petName.trim().length > 0 && selectSpecies.length === 1 && selectPersonality.length >= 1,
    [petName, selectSpecies, selectPersonality]
  );

  const [isSaving, setIsSaving] = useState(false);
  const disabled = !canSubmit || isSaving;

  // SelectBox onChange 핸들러 (숫자여도 문자열로 정규화)
  const handleSpeciesChange = useCallback(
    (next: Value[]) => setSelectSpecies(next.map(String)),
    []
  );
  const handlePersonalityChange = useCallback(
    (next: Value[]) => setSelectPersonality(next.map(String)),
    []
  );

  // 제출
  const onSubmit = useCallback(async () => {
    if (!canSubmit || isSaving) {
      log('submit blocked', { canSubmit, isSaving });
      return;
    }
    setIsSaving(true);
    setLastError(null);

    const t0 = Date.now();

    try {
      // 편집 모드면 update, 아니면 create
      if (initialPet?.id != null) {
        // 업데이트
        const body = {
          name: petName.trim(),
          breed: String(selectSpecies[0]),
          personality: selectPersonality.join(','),
        };
        setLastRequest({ mode: 'update', id: initialPet.id, body });
        log('update start', { id: initialPet.id, body });
        await updatePet(initialPet.id, body);
        log('update success', { ms: Date.now() - t0 });
      } else {
        // 생성
        const req = {
          name: petName,
          species: selectSpecies[0],
          personalities: selectPersonality,
        };
        setLastRequest({ mode: 'create', payload: req });
        const payload = buildCreatePetPayload(req);
        log('create start', { payload });
        await createPet(payload);
        log('create success', { ms: Date.now() - t0 });
      }

      showToast('반려동물 정보가 저장되었습니다.', 'info');
      onSuccessNav?.();
    } catch (e: any) {
      const info = extractError(e);
      setLastError(info);
      logErr('submit failed', {
        ...info,
        ms: Date.now() - t0,
        lastRequest,
      });

      // DEV에선 에러 상세를 좀 더 보여주면 디버깅에 유리
      const devDetails =
        debug && (info.status || info.message)
          ? `\n\n[디버그]\nstatus: ${String(info.status ?? '-')}\nmessage: ${String(info.message)}`
          : '';

      showToast('저장 중 오류가 발생했어요. 잠시 후 다시 시도해주세요.', 'delete');
      console.error(devDetails);
    } finally {
      setIsSaving(false);
    }
  }, [
    canSubmit,
    isSaving,
    initialPet?.id,
    petName,
    selectSpecies,
    selectPersonality,
    onSuccessNav,
    showToast,
  ]);

  return {
    fields: {
      petName,
      selectSpecies,
      selectPersonality,
    },
    setPetName,
    handleSpeciesChange,
    handlePersonalityChange,
    canSubmit,
    disabled,
    isPending: isSaving,
    onSubmit,

    // 디버깅용
    lastRequest,
    lastError,
  };
};
