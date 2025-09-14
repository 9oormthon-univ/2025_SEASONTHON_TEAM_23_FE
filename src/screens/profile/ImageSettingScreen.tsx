import { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  PROFILE_IMAGE_PRESETS,
  PROFILE_IMAGE_ORDER,
  type ProfileImageKey,
} from '@/constants/profileImages';
import { useAuth } from '@/provider/AuthProvider';
import { useNavigation } from '@react-navigation/native';

const ImageSettingScreen = () => {
  const { profileImageKey, setProfileImageKey } = useAuth();
  const navigation = useNavigation();
  const initialIndex = profileImageKey ? PROFILE_IMAGE_ORDER.indexOf(profileImageKey as any) : 0;
  const [selectedIndex, setSelectedIndex] = useState<number | null>(
    initialIndex >= 0 ? initialIndex : 0
  );

  useEffect(() => {
    if (profileImageKey) {
      const i = PROFILE_IMAGE_ORDER.indexOf(profileImageKey as ProfileImageKey);
      if (i >= 0) setSelectedIndex(i);
    }
  }, [profileImageKey]);

  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-bg">
      <ScrollView contentContainerStyle={{ paddingHorizontal: 28, paddingBottom: 48 }}>
        <View className="mt-6 items-center">
          <View className="h-[140px] w-[140px] items-center justify-center rounded-3xl bg-bg-light">
            {selectedIndex !== null && (
              <Image
                source={PROFILE_IMAGE_PRESETS[PROFILE_IMAGE_ORDER[selectedIndex]]}
                className="h-[132px] w-[132px] rounded-2xl"
                resizeMode="cover"
              />
            )}
          </View>
        </View>

        <View className="mt-10 flex-row items-center justify-between">
          <Text className="subHeading2B text-white">기본 프로필 사진 선택</Text>
          {selectedIndex !== null && (
            <TouchableOpacity onPress={() => setSelectedIndex(null)} activeOpacity={0.7}>
              <Text className="body2 text-gray-400">선택해제</Text>
            </TouchableOpacity>
          )}
        </View>

        <View className="mt-4 flex-row gap-4">
          {PROFILE_IMAGE_ORDER.map((key, idx) => {
            const selected = selectedIndex === idx;
            const img = PROFILE_IMAGE_PRESETS[key];
            return (
              <TouchableOpacity
                key={key}
                activeOpacity={0.85}
                onPress={() => setSelectedIndex(idx)}
                className={`h-[70px] w-[70px] items-center justify-center rounded-2xl ${
                  selected ? 'border-[2px] border-yellow-300 bg-bg-light' : 'bg-bg-light'
                }`}
              >
                <Image source={img} className="h-[62px] w-[62px] rounded-xl" resizeMode="cover" />
              </TouchableOpacity>
            );
          })}
        </View>

        <View className="mt-10">
          <TouchableOpacity
            disabled={selectedIndex === null}
            activeOpacity={0.85}
            className={`h-[52px] items-center justify-center rounded-xl ${
              selectedIndex === null ? 'bg-gray-600' : 'bg-yellow-300'
            }`}
            onPress={() => {
              if (selectedIndex === null) return;
              const key = PROFILE_IMAGE_ORDER[selectedIndex];
              setProfileImageKey(key);
              console.log('로컬 프로필 이미지 키 저장:', key);
              navigation.goBack();
            }}
          >
            <Text
              className={`subHeading2B ${selectedIndex === null ? 'text-gray-300' : 'text-gray-900'}`}
            >
              저장하기
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ImageSettingScreen;
