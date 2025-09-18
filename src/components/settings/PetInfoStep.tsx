import { View } from 'react-native';
import Input from '@common/Input';
import SelectBox from '@common/SelectBox';
import { SPECIES_OPTIONS } from '@/types/select';

type PetInfoStepProps = {
  petName: string;
  setPetName: (v: string) => void;
  selectSpecies: string[];
  handleSpeciesChange: (next: Array<string | number>) => void;
};

const PetInfoStep = ({
  petName,
  setPetName,
  selectSpecies,
  handleSpeciesChange,
}: PetInfoStepProps) => {
  return (
    <View className="gap-8">
      <Input
        label="이름"
        value={petName}
        onChange={setPetName}
        placeholder="이름을 입력해주세요."
      />
      <SelectBox
        label="종"
        items={SPECIES_OPTIONS}
        values={selectSpecies}
        onChange={handleSpeciesChange}
        placeholder="종을 선택해주세요."
        maxSelected={1}
        closeOnSelect
      />
    </View>
  );
};

export default PetInfoStep;
