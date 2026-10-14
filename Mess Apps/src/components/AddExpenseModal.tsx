import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useMess } from '../context/MessContext';
import { ExpenseCategory } from '../types';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export const AddExpenseModal: React.FC<Props> = ({ visible, onClose }) => {
  const { colors, t, members, activeMember, addExpense, triggerHaptic } = useMess();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('market');
  const [paidByMemberId, setPaidByMemberId] = useState(activeMember.id);
  const [includeInMealRate, setIncludeInMealRate] = useState(true);
  const [receiptUri, setReceiptUri] = useState<string | null>(null);

  const categories: { key: ExpenseCategory; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { key: 'market', label: t('catMarket'), icon: 'cart-outline' },
    { key: 'utilities', label: t('catUtilities'), icon: 'flash-outline' },
    { key: 'rent', label: t('catRent'), icon: 'home-outline' },
    { key: 'internet', label: t('catInternet'), icon: 'wifi-outline' },
    { key: 'cleaning', label: t('catCleaning'), icon: 'sparkles-outline' },
    { key: 'repair', label: t('catRepair'), icon: 'build-outline' },
    { key: 'other', label: t('catOther'), icon: 'ellipsis-horizontal-outline' },
  ];

  const handlePickImage = async (useCamera: boolean) => {
    triggerHaptic();
    try {
      let result;
      if (useCamera) {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('ক্যামেরা পারমিশন আবশ্যক', 'ছবি তোলার জন্য ক্যামেরা ব্যবহারের অনুমতি দিন।');
          return;
        }
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ['images'],
          quality: 0.7,
        });
      } else {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('গ্যালারি পারমিশন আবশ্যক', 'ছবি বেছে নেওয়ার জন্য গ্যালারির অনুমতি দিন।');
          return;
        }
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          quality: 0.7,
        });
      }

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setReceiptUri(result.assets[0].uri);
      }
    } catch {
      Alert.alert('ছবি আপলোড সম্ভব হয়নি', 'অনুগ্রহ করে আবার চেষ্টা করুন।');
    }
  };

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('বিবরণ আবশ্যক', 'অনুগ্রহ করে খরচের বিবরণ বা শিরোনাম লিখুন।');
      return;
    }
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('সঠিক টাকা লিখুন', 'টাকার পরিমাণ ০-এর বেশি হতে হবে।');
      return;
    }

    const todayDate = new Date().toISOString().split('T')[0];

    addExpense({
      title: title.trim(),
      amount: parsedAmount,
      category,
      expenseDate: todayDate,
      paidByMemberId,
      includeInMealRate,
      receiptPath: receiptUri || undefined,
    });

    // Reset fields
    setTitle('');
    setAmount('');
    setReceiptUri(null);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={[styles.modalBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <View style={styles.headerTitleRow}>
              <Ionicons name="receipt" size={20} color={colors.primaryLight} style={{ marginRight: 8 }} />
              <Text style={[styles.headerTitle, { color: colors.text }]}>{t('addExpense')}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
            {/* Title Input */}
            <Text style={[styles.label, { color: colors.textSecondary }]}>{t('titleOrNote')}</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.surfaceSecondary,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              placeholder="যেমন: চাল, তেল, তরকারি বাজার বা বিদ্যুৎ বিল"
              placeholderTextColor={colors.textMuted}
              value={title}
              onChangeText={setTitle}
            />

            {/* Amount Input */}
            <Text style={[styles.label, { color: colors.textSecondary }]}>{t('amount')}</Text>
            <View style={styles.amountWrap}>
              <Text style={[styles.takaSymbol, { color: colors.primaryLight }]}>৳</Text>
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

            {/* Category Selector */}
            <Text style={[styles.label, { color: colors.textSecondary }]}>{t('category')}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
              {categories.map((cat) => {
                const isSelected = category === cat.key;
                return (
                  <TouchableOpacity
                    key={cat.key}
                    style={[
                      styles.categoryChip,
                      {
                        backgroundColor: isSelected ? colors.primaryLight + '25' : colors.surfaceSecondary,
                        borderColor: isSelected ? colors.primaryLight : colors.border,
                      },
                    ]}
                    onPress={() => {
                      triggerHaptic();
                      setCategory(cat.key);
                      // Auto toggle includeInMealRate for market vs non-market
                      setIncludeInMealRate(cat.key === 'market');
                    }}
                  >
                    <Ionicons
                      name={cat.icon}
                      size={15}
                      color={isSelected ? colors.primaryLight : colors.textMuted}
                      style={{ marginRight: 5 }}
                    />
                    <Text
                      style={[
                        styles.categoryText,
                        { color: isSelected ? colors.primaryLight : colors.textSecondary },
                        isSelected && { fontWeight: '700' },
                      ]}
                    >
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Paid By Member Selector */}
            <Text style={[styles.label, { color: colors.textSecondary }]}>কে টাকা পরিশোধ করেছেন?</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.memberScroll}>
              {members.map((m) => {
                const isSelected = paidByMemberId === m.id;
                return (
                  <TouchableOpacity
                    key={m.id}
                    style={[
                      styles.memberChip,
                      {
                        backgroundColor: isSelected ? colors.primaryDark : colors.surfaceSecondary,
                        borderColor: isSelected ? colors.primaryLight : colors.border,
                      },
                    ]}
                    onPress={() => {
                      triggerHaptic();
                      setPaidByMemberId(m.id);
                    }}
                  >
                    <Text
                      style={[
                        styles.memberChipText,
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

            {/* Include in Meal Rate Toggle */}
            <View
              style={[
                styles.switchCard,
                { backgroundColor: colors.surfaceSecondary, borderColor: colors.border },
              ]}
            >
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text style={[styles.switchTitle, { color: colors.text }]}>{t('includeInMealRate')}</Text>
                <Text style={[styles.switchDesc, { color: colors.textMuted }]}>
                  {includeInMealRate
                    ? 'হ্যাঁ, এটি সরাসরি খাওয়া মিল রেটে হিসেব করা হবে'
                    : 'না, এটি মেম্বারদের মাঝে সমানভাবে বণ্টন করা ফিক্সড চার্জ'}
                </Text>
              </View>
              <Switch
                value={includeInMealRate}
                onValueChange={(val) => {
                  triggerHaptic();
                  setIncludeInMealRate(val);
                }}
                trackColor={{ false: colors.surfaceSecondary, true: colors.primaryLight }}
                thumbColor={includeInMealRate ? colors.primary : '#F4F4F5'}
              />
            </View>

            {/* Attach Receipt Image */}
            <Text style={[styles.label, { color: colors.textSecondary }]}>{t('attachReceipt')}</Text>
            {receiptUri ? (
              <View style={[styles.receiptPreviewBox, { borderColor: colors.border }]}>
                <Image source={{ uri: receiptUri }} style={styles.receiptImage} resizeMode="cover" />
                <TouchableOpacity
                  style={[styles.removeImgBtn, { backgroundColor: colors.danger }]}
                  onPress={() => setReceiptUri(null)}
                >
                  <Ionicons name="trash-outline" size={16} color="#FFF" />
                  <Text style={styles.removeImgTxt}>{t('removePhoto')}</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.photoActionsRow}>
                <TouchableOpacity
                  style={[
                    styles.photoBtn,
                    { backgroundColor: colors.surfaceSecondary, borderColor: colors.border },
                  ]}
                  onPress={() => handlePickImage(true)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="camera-outline" size={20} color={colors.primaryLight} />
                  <Text style={[styles.photoBtnTxt, { color: colors.text }]}>{t('takePhoto')}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.photoBtn,
                    { backgroundColor: colors.surfaceSecondary, borderColor: colors.border },
                  ]}
                  onPress={() => handlePickImage(false)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="images-outline" size={20} color={colors.primaryLight} />
                  <Text style={[styles.photoBtnTxt, { color: colors.text }]}>{t('chooseGallery')}</Text>
                </TouchableOpacity>
              </View>
            )}
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
              style={[styles.saveBtn, { backgroundColor: colors.primary }]}
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
    maxHeight: '92%',
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
  categoryScroll: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 12,
  },
  memberScroll: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  memberChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    marginRight: 8,
  },
  memberChipText: {
    fontSize: 12,
  },
  switchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 14,
    marginBottom: 8,
  },
  switchTitle: {
    fontSize: 12,
    fontWeight: '700',
  },
  switchDesc: {
    fontSize: 10,
    marginTop: 2,
  },
  photoActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  photoBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  photoBtnTxt: {
    fontSize: 12,
    fontWeight: '600',
  },
  receiptPreviewBox: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
    marginTop: 6,
  },
  receiptImage: {
    width: '100%',
    height: 180,
  },
  removeImgBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    gap: 6,
  },
  removeImgTxt: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
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
