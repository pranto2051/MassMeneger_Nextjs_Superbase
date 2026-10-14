import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMess } from '../context/MessContext';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export const AutoGenerateMarketModal: React.FC<Props> = ({ visible, onClose }) => {
  const { colors, t, selectedMonth, members, autoGenerateMarketSchedule, triggerHaptic } = useMess();

  const [startDate, setStartDate] = useState(`${selectedMonth}-01`);
  const [daysPerMember, setDaysPerMember] = useState(3);
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>(
    members.filter((m) => m.isActive).map((m) => m.id)
  );

  const toggleMember = (id: string) => {
    triggerHaptic();
    setSelectedMemberIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleGenerate = () => {
    if (selectedMemberIds.length === 0) {
      Alert.alert('মেম্বার নির্বাচন করুন', 'অন্তত একজন সদস্যকে রোস্টারে অন্তর্ভুক্ত করতে হবে।');
      return;
    }

    autoGenerateMarketSchedule({
      startDate,
      daysPerMember,
      selectedMemberIds,
    });

    onClose();
    Alert.alert('সফল হয়েছে!', 'চলতি মাসের বাজার শিডিউল রোস্টার স্বয়ংক্রিয়ভাবে তৈরি হয়েছে।');
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={[styles.modalBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <View style={styles.headerTitleRow}>
              <Ionicons name="sparkles" size={20} color={colors.primaryLight} style={{ marginRight: 8 }} />
              <Text style={[styles.headerTitle, { color: colors.text }]}>{t('autoGenerateSchedule')}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
            {/* Start Date */}
            <Text style={[styles.label, { color: colors.textSecondary }]}>শুরুর তারিখ (YYYY-MM-DD)</Text>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: colors.surfaceSecondary, borderColor: colors.border, color: colors.text },
              ]}
              value={startDate}
              onChangeText={setStartDate}
              placeholder="2026-10-01"
              placeholderTextColor={colors.textMuted}
            />

            {/* Days per member */}
            <Text style={[styles.label, { color: colors.textSecondary }]}>মাথাপিছু বাজারের দিন সংখ্যা</Text>
            <View style={styles.daysRow}>
              {[2, 3, 4, 5, 7].map((num) => {
                const isSelected = daysPerMember === num;
                return (
                  <TouchableOpacity
                    key={num}
                    style={[
                      styles.dayChip,
                      {
                        backgroundColor: isSelected ? colors.primaryLight + '25' : colors.surfaceSecondary,
                        borderColor: isSelected ? colors.primaryLight : colors.border,
                      },
                    ]}
                    onPress={() => {
                      triggerHaptic();
                      setDaysPerMember(num);
                    }}
                  >
                    <Text
                      style={[
                        styles.dayChipTxt,
                        { color: isSelected ? colors.primaryLight : colors.textSecondary },
                        isSelected && { fontWeight: '700' },
                      ]}
                    >
                      {num} দিন
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Members in rotation */}
            <Text style={[styles.label, { color: colors.textSecondary }]}>
              রোস্টারে অন্তর্ভুক্ত মেম্বার ({selectedMemberIds.length} জন নির্বাচিত)
            </Text>
            <View style={styles.membersGrid}>
              {members.map((m) => {
                const isSelected = selectedMemberIds.includes(m.id);
                return (
                  <TouchableOpacity
                    key={m.id}
                    style={[
                      styles.memberToggle,
                      {
                        backgroundColor: isSelected ? colors.primaryDark : colors.surfaceSecondary,
                        borderColor: isSelected ? colors.primaryLight : colors.border,
                      },
                    ]}
                    onPress={() => toggleMember(m.id)}
                  >
                    <Ionicons
                      name={isSelected ? 'checkbox' : 'square-outline'}
                      size={16}
                      color={isSelected ? '#FFF' : colors.textMuted}
                      style={{ marginRight: 6 }}
                    />
                    <Text
                      style={[
                        styles.memberToggleTxt,
                        { color: isSelected ? '#FFF' : colors.text },
                        isSelected && { fontWeight: '700' },
                      ]}
                    >
                      {m.name}
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

            <TouchableOpacity
              style={[styles.genBtn, { backgroundColor: colors.primary }]}
              onPress={handleGenerate}
            >
              <Ionicons name="sparkles" size={17} color="#FFF" style={{ marginRight: 6 }} />
              <Text style={styles.genBtnTxt}>রোস্টার তৈরি করুন</Text>
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
  headerTitleRow: {
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
  daysRow: {
    flexDirection: 'row',
    gap: 8,
  },
  dayChip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  dayChipTxt: {
    fontSize: 12,
  },
  membersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  memberToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  memberToggleTxt: {
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
  genBtn: {
    flex: 2,
    flexDirection: 'row',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  genBtnTxt: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
