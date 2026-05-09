import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors } from '../constants/colors';

export interface BottomSheetOption {
  label: string;
  onPress: () => void;
  destructive?: boolean;
  checked?: boolean;
}

interface BottomSheetProps {
  visible: boolean;
  title: string;
  options: BottomSheetOption[];
  onClose: () => void;
}

export function BottomSheet({ visible, title, options, onClose }: BottomSheetProps) {
  const { bottom } = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(300)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 220, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 260, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 0, duration: 180, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 300, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  const handleOption = (option: BottomSheetOption) => {
    onClose();
    setTimeout(() => option.onPress(), 180);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>

      <Animated.View
        style={[
          styles.sheet,
          { paddingBottom: bottom + 8, transform: [{ translateY: slideAnim }] },
        ]}
        pointerEvents="box-none"
      >
        {/* Handle */}
        <View style={styles.handle} />

        {/* Title */}
        <View style={styles.titleRow}>
          <Text style={styles.title}>{title}</Text>
        </View>

        {/* Options */}
        {options.map((opt, i) => (
          <React.Fragment key={i}>
            {i > 0 && <View style={styles.divider} />}
            <Pressable
              style={({ pressed }) => [styles.optionRow, pressed && styles.optionPressed]}
              onPress={() => handleOption(opt)}
            >
              <Text style={[styles.optionLabel, opt.destructive && styles.optionDestructive]}>
                {opt.label}
              </Text>
              {opt.checked && <Feather name="check" size={16} color={Colors.blue} />}
            </Pressable>
          </React.Fragment>
        ))}
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.65)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#131313',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.08)',
    paddingTop: 8,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignSelf: 'center',
    marginBottom: 8,
  },
  titleRow: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.45)',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  optionPressed: {
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  optionLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  optionDestructive: {
    color: Colors.red,
  },
  divider: {
    height: 0.5,
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginLeft: 20,
  },
});
