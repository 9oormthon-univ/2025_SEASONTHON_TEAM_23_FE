import { View, Text } from 'react-native';
import { PERSONALITY_CONFLICTS, PERSONALITY_OPTIONS } from '@/types/select';
import { showConflictAlert } from '@/utils/selectConflict';
import PersonalityTagGroup from '@/components/settings/PersonalityTagGroup';
import Icon from '@common/Icon';

type PetPersonalityStepProps = {
  selectPersonality: string[];
  handlePersonalityChange: (next: Array<string | number>) => void;
};

const PetPersonalityStep = ({
  selectPersonality,
  handlePersonalityChange,
}: PetPersonalityStepProps) => {
  return (
    <View className="gap-7">
      <Text className="body2 text-gray-200">{`성격에 부합하는 해시태그를 골라주세요.`}</Text>
      <View className="items-center gap-7 px-6">
        <PersonalityTagGroup
          options={PERSONALITY_OPTIONS}
          selected={selectPersonality} // string[] 유지
          onChange={(next) => handlePersonalityChange(next)}
          conflicts={PERSONALITY_CONFLICTS}
          onConflict={(picked, conflicts) => showConflictAlert?.(picked, conflicts)} // 기존 알림 유틸 재사용
        />
        <View className="flex-row items-center gap-2">
          <Icon name="IcWarning" size={16} color="#CECECE" />
          <Text className="captionSB text-gray-300">{`중복선택이 가능합니다.`}</Text>
        </View>
      </View>
    </View>
  );
};

export default PetPersonalityStep;
