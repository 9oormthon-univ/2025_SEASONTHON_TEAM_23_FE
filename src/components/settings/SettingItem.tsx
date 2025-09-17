import {Text, TouchableOpacity} from "react-native";
import Icon from "@common/Icon";

type SettingItemProps = { label: string; onPress: () => void }

const SettingItem = ({ label, onPress }: SettingItemProps) => (
    <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPress}
        className="flex-row items-center justify-between"
    >
      <Text className="subHeading2M !leading-7 text-white">{label}</Text>
      <Icon name="IcNext" size={20} color="white" />
    </TouchableOpacity>
);

export default SettingItem;
