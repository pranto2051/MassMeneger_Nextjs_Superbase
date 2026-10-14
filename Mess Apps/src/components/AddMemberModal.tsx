import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMess } from '../context/MessContext';
import { MessRole } from '../types';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export const AddMemberModal: React.FC<Props> = ({ visible, onClose }) => {
  const { colors, t, addMember, triggerHaptic } = useMess();

  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [roomNo, setRoomNo] = useState('');
  const [mobile, setMobile] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [role, setRole] = useState<MessRole>('member');

  const roles: { key: MessRole; label: string }[] = [
    { key: 'member', label: t('roleMember') },
    { key: 'manager', label: t('roleManager') },
    { key: 'owner', label: t('roleOwner') },
  ];

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('নাম আবশ্যক', 'অনুগ্রহ করে মেম্বারের পূর্ণ নাম লিখুন।');
      return;
    }

    addMember({
      name: name.trim(),
      nickname: nickname.trim() || undefined,
      roomNo: roomNo.trim() || undefined,
      mobile: mobile.trim() || undefined,
      whatsapp: whatsapp.trim() || mobile.trim() || undefined,
      joiningDate: new Date().toISOString().split('T')[0],
      isActive: true,
      role,
    });

    setName('');
    setNickname('');
    setRoomNo('');
    setMobile('');
    setWhatsapp('');
    onClose();
    Alert.alert('সফল হয়েছে!', 'নতুন মেম্বার যুক্ত হয়েছে।');
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={[styles.modalBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <View style={styles.headerLeft}>
              <Ionicons name="person-add" size={20} color={colors.primaryLight} style={{ marginRight: 8 }} />
              <Text style={[styles.headerTitle, { color: colors.text }]}>{t('addMember')}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
            {/* Full Name */}
            <Text style={[styles.label, { color: colors.textSecondary }]}>সদস্যের পুরো নাম *</Text>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: colors.surfaceSecondary, borderColor: colors.border, color: colors.text },
              ]}
              placeholder="যেমন: তানভীর আহমেদ"
              placeholderTextColor={colors.textMuted}
              value={name}
              onChangeText={setName}
            />

            {/* Nickname & Room */}
            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>ডাকনাম</Text>
                <TextInput
                  style={[
                    styles.input,
                    { backgroundColor: colors.surfaceSecondary, borderColor: colors.border, color: colors.text },
                  ]}
                  placeholder="যেমন: প্রanto"
                  placeholderTextColor={colors.textMuted}
                  value={nickname}
                  onChangeText={setNickname}
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>{t('roomNo')}</Text>
                <TextInput
                  style={[
                    styles.input,
                    { backgroundColor: colors.surfaceSecondary, borderColor: colors.border, color: colors.text },
                  ]}
                  placeholder="301"
                  placeholderTextColor={colors.textMuted}
                  value={roomNo}
                  onChangeText={setRoomNo}
                />
              </View>
            </View>

            {/* Mobile & WhatsApp */}
            <Text style={[styles.label, { color: colors.textSecondary }]}>{t('mobileNo')}</Text>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: colors.surfaceSecondary, borderColor: colors.border, color: colors.text },
              ]}
              placeholder="017XXXXXXXX"
              placeholderTextColor={colors.textMuted}
              keyboardType="phone-pad"
              value={mobile}
              onChangeText={(txt) => {
                setMobile(txt);
                if (!whatsapp) setWhatsapp(txt);
              }}
            />

            <Text style={[styles.label, { color: colors.textSecondary }]}>{t('whatsappNo')}</Text>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: colors.surfaceSecondary, borderColor: colors.border, color: colors.text },
              ]}
              placeholder="017XXXXXXXX"
              placeholderTextColor={colors.textMuted}
              keyboardType="phone-pad"
              value={whatsapp}
              onChangeText={setWhatsapp}
            />

            {/* Role Selector */}
            <Text style={[styles.label, { color: colors.textSecondary }]}>{t('role')}</Text>
            <View style={styles.rolesRow}>
              {roles.map((r) => {
                const isSelected = role === r.key;
                return (
                  <TouchableOpacity
                    key={r.key}
                    style={[
                      styles.roleChip,
                      {
                        backgroundColor: isSelected ? colors.primaryDark : colors.surfaceSecondary,
                        borderColor: isSelected ? colors.primaryLight : colors.border,
                      },
                    ]}
                    onPress={() => {
                      triggerHaptic();
                      setRole(r.key);
                    }}
                  >
                    <Text
                      style={[
                        styles.roleChipTxt,
                        { color: isSelected ? '#FFF' : colors.text },
                        isSelected && { fontWeight: '700' },
                      ]}
                    >
                      {r.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          <View style={[styles.footer, { borderTopColor: colors.border }]}>
            <TouchableOpacity style={[styles.cancelBtn, { borderColor: colors.border }]} onPress={onClose}>
              <Text style={[styles.cancelTxt, { color: colors.textSecondary }]}>{t('cancel')}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.saveBtn, { backgroundColor: colors.primary }]} onPress={handleSave}>
              <Ionicons name="person-add" size={17} color="#FFF" style={{ marginRight: 6 }} />
              <Text style={styles.saveBtnTxt}>{t('save')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'flex-end',
  },
  modalBox: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  closeBtn: {
    padding: 4,
  },
  body: {
    padding: 18,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
  },
  row: {
    flexDirection: 'row',
  },
  rolesRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  roleChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  roleChipTxt: {
    fontSize: 12,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderTopWidth: 1,
    gap: 10,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  cancelTxt: {
    fontSize: 13,
    fontWeight: '600',
  },
  saveBtn: {
    flex: 2,
    flexDirection: 'row',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnTxt: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
