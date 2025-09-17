import { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  Platform,
  ActivityIndicator,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/provider/AuthProvider';
import { useUpsertNickname } from '@/hooks/mutations/useUpsertNickname';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ProfileStackParamList } from '@/types/navigation';
import Icon from '@common/Icon';

const SettingItem = ({ label, onPress }: { label: string; onPress: () => void }) => (
  <TouchableOpacity
    activeOpacity={0.7}
    onPress={onPress}
    className="flex-row items-center justify-between"
  >
    <Text className="subHeading2M !leading-7 text-white">{label}</Text>
    <Icon name="IcNext" size={20} color="white" />
  </TouchableOpacity>
);

const Divider = () => <View className="h-px w-full bg-[#313A48]" />;

const SectionTitle = ({ title }: { title: string }) => (
  <Text className="subHeading3 !leading-7 text-gray-500">{title}</Text>
);

const SettingScreen = () => {
  const { user, logout, withdraw } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const [nicknameModal, setNicknameModal] = useState(false);
  const [nickname, setNickname] = useState(user?.nickname ?? '');
  const [touched, setTouched] = useState(false);
  const { mutate: saveNickname, isPending } = useUpsertNickname();
  const [withdrawing, setWithdrawing] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const MIN = 1;
  const MAX = 12;
  const VALID = /^[가-힣a-zA-Z0-9_]+$/;

  const validation = (() => {
    if (!touched) return '';
    const v = nickname.trim();
    if (!v) return '닉네임을 입력해주세요.';
    if (v.length < MIN) return `최소 ${MIN}자 이상`;
    if (v.length > MAX) return `최대 ${MAX}자까지`;
    if (!VALID.test(v)) return '허용되지 않은 문자예요.';
    return '';
  })();

  const submitNickname = useCallback(() => {
    if (validation || nickname.trim() === user?.nickname) return;
    const newNickname = nickname.trim();
    saveNickname(newNickname, {
      onSuccess: () => {
        console.log('닉네임 변경 성공: ', newNickname);
        setNicknameModal(false);
      },
      onError: (err) => {
        Alert.alert('닉네임 변경', '변경에 실패했어요. 다시 시도해주세요.');
        console.error('닉네임 변경 실패: ', err);
      },
    });
  }, [validation, nickname, user?.nickname, saveNickname]);

  const onChangePhoto = () => {
    navigation.navigate('ImageSetting');
  };

  const onManagePets = () => {
    navigation.navigate('PetManage');
  };

  const confirmLogout = () => {
    Alert.alert('로그아웃', '정말 로그아웃 하시겠어요?', [
      { text: '취소', style: 'cancel' },
      {
        text: '확인',
        style: 'destructive',
        onPress: async () => {
          if (loggingOut) return;
          setLoggingOut(true);
          try {
            await logout();
          } finally {
            setLoggingOut(false);
          }
        },
      },
    ]);
  };

  const openChannel = () => {
    Linking.openURL('https://pf.kakao.com/_xdRxgkn');
  };

  const confirmWithdrawal = () => {
    Alert.alert('회원 탈퇴', '탈퇴 시 모든 정보가 삭제됩니다. 정말 진행하시겠어요?', [
      { text: '취소', style: 'cancel' },
      {
        text: '탈퇴',
        style: 'destructive',
        onPress: async () => {
          if (withdrawing) return;
          setWithdrawing(true);
          try {
            await withdraw();
          } catch (e) {
            Alert.alert('탈퇴 실패', '잠시 후 다시 시도해주세요.');
            console.error('withdraw error', e);
          } finally {
            console.log('탈퇴 완료, 온보딩으로 이동');
            setWithdrawing(false);
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-bg">
      <ScrollView>
        <View className="gap-6 px-7 pb-10 pt-6">
          <View className="gap-5">
            <SectionTitle title="프로필 관리" />
            <View className="gap-4">
              <SettingItem label="프로필 사진 변경" onPress={onChangePhoto} />
              <SettingItem label="닉네임 변경" onPress={() => setNicknameModal(true)} />
              <SettingItem label="반려동물 관리" onPress={onManagePets} />
            </View>
          </View>
          <Divider />
          <View className="gap-5">
            <SectionTitle title="계정 관리" />
            <View className="gap-4">
              <SettingItem
                label={loggingOut ? '로그아웃 중...' : '로그아웃'}
                onPress={confirmLogout}
              />
              <SettingItem
                label={withdrawing ? '탈퇴 진행 중...' : '탈퇴하기'}
                onPress={confirmWithdrawal}
              />
            </View>
          </View>
          <Divider />
          <View className="gap-5">
            <SectionTitle title="고객센터" />
            <View className="gap-4">
              <SettingItem label="카카오톡 채널로 이동" onPress={openChannel} />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* 닉네임 변경 모달 */}
      <Modal
        visible={nicknameModal}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setNicknameModal(false)}
      >
        <Pressable
          className="flex-1 bg-black/60"
          onPress={() => !isPending && setNicknameModal(false)}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            className="flex-1 justify-center px-6"
          >
            <Pressable
              onPress={(e) => e.stopPropagation()}
              className="rounded-2xl bg-bg-light px-5 py-6"
            >
              <Text className="subHeading1B text-white">닉네임 변경</Text>
              <Text className="body3 mt-2 text-gray-500">
                한글/영문/숫자/언더바 {MIN}~{MAX}자
              </Text>
              <View className="mt-5 rounded-xl bg-bg px-4 py-3">
                <TextInput
                  value={nickname}
                  onChangeText={(t) => {
                    setNickname(t);
                    if (!touched) setTouched(true);
                  }}
                  placeholder="새 닉네임"
                  placeholderTextColor="gray-500"
                  autoCapitalize="none"
                  autoCorrect={false}
                  maxLength={MAX}
                  onBlur={() => setTouched(true)}
                  className="body1 leading-[20px] text-white"
                  style={{
                    paddingVertical: 0,
                    textAlignVertical: 'center',
                    lineHeight: 16,
                    height: 22,
                  }}
                  allowFontScaling={false}
                />
              </View>
              {!!validation && <Text className="body3 mt-2 text-error">{validation}</Text>}
              <View className="mt-6 flex-row gap-3">
                <TouchableOpacity
                  disabled={isPending}
                  onPress={() => setNicknameModal(false)}
                  className="flex-1 items-center justify-center rounded-xl bg-gray-700 py-3"
                  activeOpacity={0.8}
                >
                  <Text className="subHeading2B text-white">취소</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  disabled={!!validation || nickname.trim() === user?.nickname || isPending}
                  onPress={submitNickname}
                  className={`flex-1 items-center justify-center rounded-xl py-3 ${
                    !!validation || nickname.trim() === user?.nickname || isPending
                      ? 'bg-yellow-200'
                      : 'bg-yellow-300'
                  }`}
                  activeOpacity={0.85}
                >
                  {isPending ? (
                    <ActivityIndicator color="#121826" />
                  ) : (
                    <Text
                      className={`subHeading2B ${
                        !!validation || nickname.trim() === user?.nickname
                          ? 'text-gray-800/50'
                          : 'text-gray-900'
                      }`}
                    >
                      저장
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </Pressable>
          </KeyboardAvoidingView>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

export default SettingScreen;
