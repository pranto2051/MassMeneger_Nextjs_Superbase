import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMess } from '../context/MessContext';
import { PaymentMethod } from '../types';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export const AddDepositModal: React.FC<Props> = ({ visible, onClose }) => {
  const { colors, t, members, activeMember, addDeposit, triggerHaptic } = useMess();

  const [memberId, setMemberId] = useState(activeMember.id);
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [referenceNote, setReferenceNote] = useState('');

  const methods: { key: PaymentMethod; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { key: 'cash', label: t('methodCash'), icon: 'cash-outline' },
    { key: 'bkash', label: t('methodBkash'), icon: 'phone-portrait-outline' },
    { key: 'nagad', label: t('methodNagad'), icon: 'wallet-outline' },
    { key: 'bank', label: t('methodBank'), icon: 'business-outline' },
  ];

  const handleSave = () => {
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('টাকার পরিমাণ লিখুন', 'টাকার পরিমাণ ০ এর চেয়ে বেশি হতে হবে।');
      return;
    }

    const todayDate = new Date().toISOString().split('T')[0];

    addDeposit({
      memberId,
      amount: parsedAmount,
      depositDate: todayDate,
      paymentMethod,
      referenceNote: referenceNote.trim() || undefined,
    });

    setAmount('');
    setReferenceNote('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={[styles.modalBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <View style={styles.headerTitleRow}>
              <Ionicons name="card" size={20} color={colors.success} style={{ marginRight: 8 }} />
              <Text style={[styles.headerTitle, { color: colors.text }]}>{t('recordDeposit')}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
            {/* Member Selector */}
            <Text style={[styles.label, { color: colors.textSecondary }]}>{t('member')}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollRow}>
              {members.map((m) => {
                const isSelected = memberId === m.id;
                return (
                  <TouchableOpacity
                    key={m.id}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: isSelected ? colors.primaryDark : colors.surfaceSecondary,
                        borderColor: isSelected ? colors.primaryLight : colors.border,
                      },
                    ]}
                    onPress={() => {
                      triggerHaptic();
                      setMemberId(m.id);
                    }}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        { color: isSelected ? '#FFF' : colors.text },
                        isSelected && { fontWeight: '700' },
                      ]}
                    >
                      {m.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Amount */}
            <Text style={[styles.label, { color: colors.textSecondary }]}>{t('amount')}</Text>
            <View style={styles.amountWrap}>
              <Text style={[styles.takaSymbol, { color: colors.success }]}>৳</Text>
              <TextInput
                style={[
                  styles.input,
                  styles.amountInput,
                  {
                    backgroundColor: colors.surfaceSecondary,
                    borderColor: colors.border,
                    color: colors.text,
                  },
                ]}
                placeholder="০.০০"
                placeholderTextColor={colors.textMuted}
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
              />
            </View>

            {/* Quick Amount Buttons */}
            <View style={styles.quickAmtsRow}>
              {[1000, 2000, 3000, 4000].map((quickVal) => (
                <TouchableOpacity
                  key={quickVal}
                  style={[
                    styles.quickAmtBtn,
                    { backgroundColor: colors.surfaceSecondary, borderColor: colors.border },
                  ]}
                  onPress={() => {
                    triggerHaptic();
                    setAmount(String(quickVal));
                  }}
                >
                  <Text style={[styles.quickAmtTxt, { color: colors.primaryLight }]}>৳{quickVal}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Payment Method */}
            <Text style={[styles.label, { color: colors.textSecondary }]}>{t('paymentMethod')}</Text>
            <View style={styles.methodsGrid}>
              {methods.map((meth) => {
                const isSelected = paymentMethod === meth.key;
                return (
                  <TouchableOpacity
                    key={meth.key}
                    style={[
                      styles.methodCard,
                      {
                        backgroundColor: isSelected ? colors.primaryLight + '22' : colors.surfaceSecondary,
                        borderColor: isSelected ? colors.primaryLight : colors.border,
                      },
                    ]}
                    onPress={() => {
                      triggerHaptic();
                      setPaymentMethod(meth.key);
                    }}
                  >
                    <Ionicons
                      name={meth.icon}
                      size={18}
                      color={isSelected ? colors.primaryLight : colors.textMuted}
                      style={{ marginBottom: 4 }}
                    />
                    <Text
                      style={[
                        styles.methodText,
                        { color: isSelected ? colors.primaryLight : colors.textSecondary },
                        isSelected && { fontWeight: '700' },
                      ]}
                    >
                      {meth.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Reference Note */}
            <Text style={[styles.label, { color: colors.textSecondary }]}>রেফারেন্স বা বিবরণ (ঐচ্ছিক)</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.surfaceSecondary,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              placeholder="যেমন: TrxID বা মাসের প্রথম কিস্তি"
              placeholderTextColor={colors.textMuted}
              value={referenceNote}
              onChangeText={setReferenceNote}
            />
          </ScrollView>

          {/* Footer Save */}
          <View style={[styles.footer, { borderTopColor: colors.border }]}>
            <TouchableOpacity
              style={[styles.cancelBtn, { borderColor: colors.border }]}
              onPress={onClose}
            >
              <Text style={[styles.cancelBtnTxt, { color: colors.textSecondary }]}>{t('cancel')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.saveBtn, { backgroundColor: colors.success }]}
              onPress={handleSave}
            >
              <Ionicons name="checkmark-circle-outline" size={18} color="#FFF" style={{ marginRight: 6 }} />
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
    maxHeight: '90%',
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
  scrollRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    marginRight: 8,
  },
  chipText: {
    fontSize: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
  },
  amountWrap: {
    position: 'relative',
    justifyContent: 'center',
  },
  takaSymbol: {
    position: 'absolute',
    left: 14,
    fontSize: 18,
    fontWeight: '800',
    zIndex: 1,
  },
  amountInput: {
    paddingLeft: 34,
    fontSize: 18,
    fontWeight: '700',
  },
  quickAmtsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  quickAmtBtn: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  quickAmtTxt: {
    fontSize: 12,
    fontWeight: '700',
  },
  methodsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  methodCard: {
    width: '48%',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  methodText: {
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
  cancelBtnTxt: {
    fontSize: 14,
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
    fontSize: 14,
    fontWeight: '700',
  },
});
