import { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  PROFILE_IMAGE_PRESETS,
  PROFILE_IMAGE_ORDER,
  type ProfileImageKey,
} from '@/constants/profileImages';
import { useAuth } from '@/provider/AuthProvider';
import { useNavigation } from '@react-navigation/native';
import { setHeaderExtras } from '@/types/Header';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ProfileStackParamList } from '@/types/navigation';
import ScreenHeader from '@/components/settings/ScreenHeader';

const ImageSettingScreen = () => {
  const { profileImageKey, setProfileImageKey } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const initialIndex = profileImageKey
    ? PROFILE_IMAGE_ORDER.indexOf(profileImageKey as ProfileImageKey)
    : -1;
  const [selectedIndex, setSelectedIndex] = useState<number | null>(
    initialIndex >= 0 ? initialIndex : null
  );

  useEffect(() => {
    if (profileImageKey) {
      const i = PROFILE_IMAGE_ORDER.indexOf(profileImageKey as ProfileImageKey);
      if (i >= 0) setSelectedIndex(i);
    } else {
      setSelectedIndex(null);
    }
  }, [profileImageKey]);

  useLayoutEffect(() => {
    console.log('ImageSettingScreen - 헤더 설정:', {
      selectedIndex,
      disabled: selectedIndex === null,
    });
    setHeaderExtras(navigation, {
      hasBack: true,
      bgColor: '#121826',
      hasButton: true,
      label: '저장',
      onBack: () => {
        console.log('뒤로가기 버튼 클릭됨');
        if (navigation.canGoBack()) {
          navigation.goBack();
        } else {
          navigation.replace('Setting');
        }
      },
      onPress: () => {
        console.log('저장 버튼 클릭됨, selectedIndex:', selectedIndex);
        if (selectedIndex === null) {
          console.log('selectedIndex가 null이므로 저장 취소');
          return;
        }
        const key = PROFILE_IMAGE_ORDER[selectedIndex];
        console.log('프로필 이미지 변경 시도:', { selectedIndex, key });
        setProfileImageKey(key);
        console.log('로컬 프로필 이미지 키 저장 완료:', key);
        navigation.goBack();
      },
      disabled: selectedIndex === null,
    });
  }, [navigation, selectedIndex]);

  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-bg">
      <ScrollView>
        <ScreenHeader title="프로필 사진 변경" />
        <View className="gap-12 px-7 pb-14 pt-11">
          <View className="items-center">
            <View className="h-[120px] w-[120px] items-center justify-center rounded-[18px] border-[1.5px] border-gray-300">
              {selectedIndex !== null && (
                <Image
                  source={PROFILE_IMAGE_PRESETS[PROFILE_IMAGE_ORDER[selectedIndex]]}
                  className="h-[120px] w-[120px] rounded-[18px]"
                  resizeMode="cover"
                />
              )}
            </View>
          </View>

          <View className="gap-3">
            <View className="flex-row items-center justify-between">
              <Text className="subHeading2M !leading-7 text-white">{`기본 프로필 사진 선택`}</Text>
              {selectedIndex !== null && (
                <TouchableOpacity onPress={() => setSelectedIndex(null)} activeOpacity={0.7}>
                  <Text className="body1 text-gray-500">{`선택해제`}</Text>
                </TouchableOpacity>
              )}
            </View>

            <View className="flex-row justify-evenly">
              {PROFILE_IMAGE_ORDER.map((key, idx) => {
                const selected = selectedIndex === idx;
                const img = PROFILE_IMAGE_PRESETS[key];
                return (
                  <TouchableOpacity
                    key={key}
                    onPress={() => setSelectedIndex(idx)}
                    style={!selected ? { opacity: 0.4 } : undefined}
                  >
                    <View
                      className={`h-[62px] w-[62px] items-center justify-center overflow-hidden rounded-xl border-2 bg-[#464646] ${
                        selected ? 'border-yellow-200' : 'border-gray-300'
                      }`}
                    >
                      <Image source={img} className="h-full w-full" resizeMode="cover" />
                      {!selected && (
                        <View
                          pointerEvents="none"
                          className="absolute bottom-0 left-0 right-0 top-0 rounded-[10px] bg-black/5"
                        />
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ImageSettingScreen;
