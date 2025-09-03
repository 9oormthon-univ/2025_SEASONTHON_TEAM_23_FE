import { Alert } from 'react-native';
import { useCallback, useState } from 'react';
import { useAuth } from '@/provider/AuthProvider';

export const useKakaoLogin = () => {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const onKakaoPress = useCallback(async () => {
    try {
      setLoading(true);
      await login();
    } catch (error: any) {
      const msg =
        error?.message ??
        '로그인에 실패했어요. 카카오 앱 및 계정 상태와 네트워크를 확인한 뒤 다시 시도해 주세요.';
      Alert.alert('카카오 로그인', msg);
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, onKakaoPress };
};
