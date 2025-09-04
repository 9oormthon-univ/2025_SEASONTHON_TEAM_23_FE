import { forwardRef, useRef, useState } from 'react';
import { Pressable, Text, TextInput, type TextInputProps, View } from 'react-native';

type TextAreaProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  maxLength?: number;
  disabled?: boolean;
  showCounter?: boolean;
  /** px 단위 최소 높이 */
  minHeight?: number;
  /** 바깥에서 추가하고 싶은 Tailwind 클래스 */
  containerClassName?: string;
  inputClassName?: string;
  counterClassName?: string;
} & Omit<TextInputProps, 'value' | 'onChangeText' | 'placeholder' | 'maxLength'>;

const TextArea = forwardRef<TextInput, TextAreaProps>(
  (
    {
      value,
      onChangeText,
      placeholder = '텍스트를 입력해주세요.',
      maxLength = 500,
      disabled = false,
      showCounter = true,
      minHeight = 274,
      containerClassName = '',
      inputClassName = '',
      counterClassName = '',
      onFocus,
      onBlur,
      ...rest
    },
    ref
  ) => {
    const [focused, setFocused] = useState(false);
    const innerRef = useRef<TextInput>(null);
    const setRefs = (node: TextInput | null) => {
      innerRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref && 'current' in (ref as any)) (ref as any).current = node;
    };
    const focusInput = () => innerRef.current?.focus();

    return (
      <Pressable
        disabled={disabled}
        onPress={() => {
          if (!disabled) focusInput();
        }}
        android_ripple={{ color: 'rgba(0,0,0,0.06)', borderless: false }}
        className={`w-full rounded-[20px] bg-white p-5
        ${focused ? 'border border-gray-800' : 'border border-transparent'}
        ${containerClassName}`}
      >
        <TextInput
          ref={setRefs}
          value={value}
          onChangeText={onChangeText}
          editable={!disabled}
          selectTextOnFocus={!disabled}
          placeholder={placeholder}
          placeholderTextColor="#BABABA"
          multiline
          textAlignVertical="top"
          maxLength={maxLength}
          onFocus={(e) => {
            if (!disabled) setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          underlineColorAndroid="transparent"
          style={{ minHeight }}
          className={`body1 !leading-6 text-gray-900 ${inputClassName}`}
          {...rest}
        />

        {showCounter && (
          <View className="items-end">
            <Text className={`captionSB text-gray-400 ${counterClassName}`}>
              {value.length} / 최대 {maxLength}자
            </Text>
          </View>
        )}
      </Pressable>
    );
  }
);

export default TextArea;
