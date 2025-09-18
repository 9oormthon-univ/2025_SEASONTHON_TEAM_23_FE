// components/settings/ProgressBar.tsx
import { View } from 'react-native';

type ProgressBarProps = { step: 1 | 2; total?: number };

const ProgressBar = ({ step, total = 2 }: ProgressBarProps) => {
  const clamped = Math.max(0, Math.min(step, total));
  const ratio = total > 0 ? clamped / total : 0;

  return (
    <View className="py-3">
      {/* 트랙 */}
      <View
        style={{
          height: 3,
          width: '100%',
          borderRadius: 9999,
          backgroundColor: '#4B5563', // gray-600
          overflow: 'hidden',
        }}
      >
        {/* 채움 */}
        <View
          style={{
            height: 3,
            width: `${ratio * 100}%`, // 1단계 50%, 2단계 100%
            backgroundColor: '#FFD86F',
            borderRadius: 9999,
          }}
        />
      </View>
    </View>
  );
};

export default ProgressBar;
