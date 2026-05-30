import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Modal as RNModal, StyleSheet, type TextInputProps as RNTextInputProps } from 'react-native';
import { colors, fonts } from '@lockin90/tokens';

interface BaseProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (v: string) => void;
}

export function Input({ label, value, onChangeText, placeholder, ...rest }: BaseProps & RNTextInputProps) {
  return (
    <View>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput style={styles.input} value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={colors.textMuted} {...rest} />
    </View>
  );
}

export function NumberInput({ label, value, onChangeText, placeholder, unit }: BaseProps & { unit?: string }) {
  return (
    <View>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.row}>
        <TextInput style={[styles.input, { flex: 1 }]} value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={colors.textMuted} keyboardType="numeric" />
        {unit && <Text style={styles.unit}>{unit}</Text>}
      </View>
    </View>
  );
}

export function PasswordInput({ label, value, onChangeText, placeholder }: BaseProps) {
  const [show, setShow] = useState(false);
  return (
    <View>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.row}>
        <TextInput style={[styles.input, { flex: 1 }]} value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={colors.textMuted} secureTextEntry={!show} autoCapitalize="none" />
        <Pressable onPress={() => setShow(s => !s)} style={styles.toggle}><Text style={styles.toggleText}>{show ? 'HIDE' : 'SHOW'}</Text></Pressable>
      </View>
    </View>
  );
}

interface SelectProps {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  options: Array<string | { value: string; label: string }>;
}

export function Select({ label, value, onChange, options }: SelectProps) {
  const [open, setOpen] = useState(false);
  const norm = options.map(o => typeof o === 'string' ? { value: o, label: o } : o);
  const current = norm.find(o => o.value === value);
  return (
    <View>
      {label && <Text style={styles.label}>{label}</Text>}
      <Pressable style={styles.input} onPress={() => setOpen(true)}>
        <Text style={{ color: current ? colors.textPrimary : colors.textMuted, fontFamily: fonts.ui, fontSize: 17 }}>
          {current ? current.label : 'Select…'}
        </Text>
      </Pressable>
      <RNModal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <View style={styles.sheet}>
            {norm.map(o => (
              <Pressable key={o.value} style={styles.option} onPress={() => { onChange(o.value); setOpen(false); }}>
                <Text style={{ color: colors.textPrimary, fontFamily: fonts.ui, fontSize: 16 }}>{o.label}</Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </RNModal>
    </View>
  );
}

const styles = StyleSheet.create({
  label:      { fontFamily: fonts.displayBold, fontSize: 11, letterSpacing: 1.8, color: colors.textSecondary, textTransform: 'uppercase', marginBottom: 6 },
  input:      { borderBottomWidth: 2, borderColor: colors.borderStrong, paddingVertical: 10, paddingHorizontal: 0, color: colors.textPrimary, fontFamily: fonts.uiMedium, fontSize: 17 },
  row:        { flexDirection: 'row', alignItems: 'center' },
  unit:       { fontFamily: fonts.mono, fontSize: 10, color: colors.textMuted, marginLeft: 8 },
  toggle:     { paddingHorizontal: 8, paddingVertical: 4 },
  toggleText: { fontFamily: fonts.mono, fontSize: 10, color: colors.textSecondary, letterSpacing: 0.8 },
  backdrop:   { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  sheet:      { backgroundColor: colors.bgElevated, borderTopWidth: 1, borderColor: colors.borderStrong, paddingVertical: 8 },
  option:     { paddingVertical: 14, paddingHorizontal: 20 },
});
