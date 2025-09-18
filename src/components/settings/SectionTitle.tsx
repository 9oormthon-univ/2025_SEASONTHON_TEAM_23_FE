import { Text } from 'react-native';

type SectionTitleProps = { title: string };

const SectionTitle = ({ title }: SectionTitleProps) => (
  <Text className="subHeading3 !leading-7 text-gray-500">{title}</Text>
);

export default SectionTitle;
