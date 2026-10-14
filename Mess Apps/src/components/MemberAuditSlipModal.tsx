import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  Alert,
  Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMess } from '../context/MessContext';
import { MemberMonthlyStatement } from '../types';

interface Props {
  visible: boolean;
  onClose: () => void;
  statement: MemberMonthlyStatement | null;
}

export const MemberAuditSlipModal: React.FC<Props> = ({ visible, onClose, statement }) => {
  const {
    colors,
    mess,
    t,
    currentMonthLabel,
    settlement,
    members,
    filteredExpenses,
    filteredDeposits,
    triggerHaptic,
  } = useMess();

  if (!statement) return null;

  const member = members.find((m) => m.id === statement.memberId);
  const isSurplus = statement.netBalance >= 0;

  // Expenses paid by this member this month
  const memberExpenses = filteredExpenses.filter((e) => e.paidByMemberId === statement.memberId);
  const totalMarketPaid = memberExpenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

  // Deposits made by this member this month
  const memberDeposits = filteredDeposits.filter((d) => d.memberId === statement.memberId);

  const handleShare = async () => {
    triggerHaptic();
    const shareMessage = `📋 ${mess.name} — মাসিক অডিট স্লিপ\n` +
      `👤 সদস্য: ${statement.memberName} (রুম: ${statement.roomNo || 'N/A'})\n` +
      `📅 হিসাবের মাস: ${currentMonthLabel}\n` +
      `--------------------------------\n` +
      `• মোট খাওয়া মিল: ${statement.totalMeals} টি (রেট: ৳${settlement.mealRate})\n` +
      `• খাবার মিল খরচ: ৳${statement.mealCost}\n` +
      `• শেয়ার্ড ফিক্সড চার্জ: ৳${statement.individualExpenses}\n` +
      `• মেস ফান্ডে জমা: ৳${statement.totalDeposits}\n` +
      `--------------------------------\n` +
      `💰 নিট ব্যালেন্স: ${isSurplus ? '+' : ''}৳${statement.netBalance}\n` +
      `📢 অবস্থা: ${isSurplus ? 'মেস ফেরত দেবে (সারপ্লাস)' : 'মেসে বকেয়া জমা দেবে (বকেয়া)'}\n\n` +
      `✅ অফিসিয়ালি নিরীক্ষিত ও চূড়ান্ত হিসাব`;

    try {
      await Share.share({
        message: shareMessage,
        title: `${statement.memberName} — অডিট স্লিপ (${currentMonthLabel})`,
      });
    } catch {
      Alert.alert('শেয়ার সম্পন্ন করা যায়নি', shareMessage);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={[styles.modalBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {/* Header */}
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <View style={styles.headerLeft}>
              <Ionicons name="document-text" size={20} color={colors.primaryLight} style={{ marginRight: 8 }} />
              <View>
                <Text style={[styles.headerTitle, { color: colors.text }]}>{t('auditSlipHeader')}</Text>
                <Text style={[styles.headerSubtitle, { color: colors.textMuted }]}>
                  {mess.name} • {currentMonthLabel}
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Body Content */}
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Member Identity Card */}
            <View style={[styles.memberCard, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}>
              <View style={styles.memberRow}>
                <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
                  <Text style={styles.avatarTxt}>{statement.memberName[0]}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.memberNameTxt, { color: colors.text }]}>{statement.memberName}</Text>
                  <Text style={[styles.memberSubTxt, { color: colors.textMuted }]}>
                    রুম নং: {statement.roomNo || 'N/A'} • মোবাইল: {statement.mobile || 'N/A'}
                  </Text>
                </View>
                <View
                  style={[
                    styles.roleBadge,
                    {
                      backgroundColor:
                        member?.role === 'owner' || member?.role === 'manager'
                          ? colors.primaryDark
                          : colors.surface,
                    },
                  ]}
                >
                  <Text style={styles.roleBadgeTxt}>
                    {member?.role === 'owner' ? t('roleOwner') : member?.role === 'manager' ? t('roleManager') : t('roleMember')}
                  </Text>
                </View>
              </View>
            </View>

            {/* Formula Banner */}
            <View style={[styles.formulaBox, { backgroundColor: 'rgba(99, 102, 241, 0.08)', borderColor: colors.borderHighlight }]}>
              <Text style={[styles.formulaTitle, { color: colors.primaryLight }]}>{t('formulaLedger')}</Text>
              <Text style={[styles.formulaEq, { color: colors.textSecondary }]}>{t('formulaNote')}</Text>
            </View>

            {/* Step-by-Step Ledger Calculation */}
            <View style={[styles.ledgerCard, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}>
              {/* Step 1 */}
              <View style={styles.ledgerRow}>
                <View style={styles.stepIndicator}>
                  <Text style={[styles.stepNum, { color: colors.success }]}>১</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.ledgerLabel, { color: colors.text }]}>{t('totalDepositsPlus')}</Text>
                  <Text style={[styles.ledgerNote, { color: colors.textMuted }]}>
                    {memberDeposits.length} টি কিস্তিতে দেওয়া ডিপোজিট
                  </Text>
                </View>
                <Text style={[styles.ledgerAmount, { color: colors.success }]}>
                  +৳{statement.totalDeposits.toLocaleString()}
                </Text>
              </View>

              <View style={[styles.ledgerDivider, { backgroundColor: colors.border }]} />

              {/* Step 2 */}
              <View style={styles.ledgerRow}>
                <View style={styles.stepIndicator}>
                  <Text style={[styles.stepNum, { color: colors.danger }]}>২</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.ledgerLabel, { color: colors.text }]}>{t('mealCostMinus')}</Text>
                  <Text style={[styles.ledgerNote, { color: colors.textMuted }]}>
                    {statement.totalMeals} মিল × ৳{settlement.mealRate} রেট
                  </Text>
                </View>
                <Text style={[styles.ledgerAmount, { color: colors.danger }]}>
                  -৳{statement.mealCost.toLocaleString()}
                </Text>
              </View>

              <View style={[styles.ledgerDivider, { backgroundColor: colors.border }]} />

              {/* Step 3 */}
              <View style={styles.ledgerRow}>
                <View style={styles.stepIndicator}>
                  <Text style={[styles.stepNum, { color: colors.warning }]}>৩</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.ledgerLabel, { color: colors.text }]}>{t('fixedCostMinus')}</Text>
                  <Text style={[styles.ledgerNote, { color: colors.textMuted }]}>
                    ওয়াইফাই, খালা ও সাধারণ রক্ষণাবেক্ষণ
                  </Text>
                </View>
                <Text style={[styles.ledgerAmount, { color: colors.warning }]}>
                  -৳{statement.individualExpenses.toLocaleString()}
                </Text>
              </View>
            </View>

            {/* Final Balance Box */}
            <View
              style={[
                styles.finalBox,
                {
                  backgroundColor: isSurplus ? colors.successBg : colors.dangerBg,
                  borderColor: isSurplus ? colors.successBorder : colors.dangerBorder,
                },
              ]}
            >
              <View>
                <Text style={[styles.finalLabel, { color: isSurplus ? colors.success : colors.danger }]}>
                  {t('finalNetBalance')}
                </Text>
                <Text style={[styles.finalVerdict, { color: isSurplus ? colors.success : colors.danger }]}>
                  {isSurplus ? t('surplusMessWillPay') : t('dueMemberWillPay')}
                </Text>
              </View>
              <Text style={[styles.finalValue, { color: isSurplus ? colors.success : colors.danger }]}>
                {isSurplus ? '+' : ''}৳{Math.abs(statement.netBalance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </Text>
            </View>

            {/* Shopping & Market info if member shopped */}
            {memberExpenses.length > 0 && (
              <View style={[styles.subSection, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}>
                <Text style={[styles.subSectionTitle, { color: colors.text }]}>
                  🛒 {t('marketListTitle')} ({memberExpenses.length} টি বাজার, মোট ৳{totalMarketPaid.toLocaleString()})
                </Text>
                {memberExpenses.map((exp) => (
                  <View key={exp.id} style={styles.expenseItem}>
                    <Text style={[styles.expTitle, { color: colors.textSecondary }]} numberOfLines={1}>
                      • {exp.title}
                    </Text>
                    <Text style={[styles.expAmt, { color: colors.primaryLight }]}>৳{exp.amount}</Text>
                  </View>
                ))}
                <Text style={[styles.reconcileNote, { color: colors.textMuted }]}>{t('marketCreditNote')}</Text>
              </View>
            )}

            {/* Official Verification Stamp */}
            <View style={[styles.stampCard, { borderColor: colors.border }]}>
              <Ionicons name="checkmark-circle" size={24} color={colors.success} style={{ marginRight: 8 }} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.stampTitle, { color: colors.text }]}>{t('verifiedAuditStamp')}</Text>
                <Text style={[styles.stampDesc, { color: colors.textMuted }]}>
                  হিসাব মাস: {currentMonthLabel} • চূড়ান্ত মিল রেট: ৳{settlement.mealRate}
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* Footer Actions */}
          <View style={[styles.modalFooter, { borderTopColor: colors.border }]}>
            <TouchableOpacity
              style={[styles.shareBtn, { backgroundColor: colors.primary }]}
              onPress={handleShare}
              activeOpacity={0.8}
            >
              <Ionicons name="share-social-outline" size={17} color="#FFF" style={{ marginRight: 6 }} />
              <Text style={styles.shareBtnTxt}>{t('shareSlip')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.closeFooterBtn, { borderColor: colors.border }]}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <Text style={[styles.closeFooterBtnTxt, { color: colors.textSecondary }]}>{t('close')}</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalBox: {
    width: '100%',
    maxHeight: '90%',
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  headerSubtitle: {
    fontSize: 11,
    marginTop: 1,
  },
  closeBtn: {
    padding: 4,
  },
  scrollContent: {
    padding: 16,
  },
  memberCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    marginBottom: 12,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarTxt: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  memberNameTxt: {
    fontSize: 15,
    fontWeight: '700',
  },
  memberSubTxt: {
    fontSize: 11,
    marginTop: 2,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  roleBadgeTxt: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  },
  formulaBox: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 10,
    marginBottom: 12,
  },
  formulaTitle: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 2,
  },
  formulaEq: {
    fontSize: 11,
  },
  ledgerCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    marginBottom: 12,
  },
  ledgerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  stepIndicator: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  stepNum: {
    fontSize: 12,
    fontWeight: '800',
  },
  ledgerLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  ledgerNote: {
    fontSize: 10,
    marginTop: 2,
  },
  ledgerAmount: {
    fontSize: 14,
    fontWeight: '800',
  },
  ledgerDivider: {
    height: 1,
  },
  finalBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 14,
    marginBottom: 12,
  },
  finalLabel: {
    fontSize: 13,
    fontWeight: '800',
  },
  finalVerdict: {
    fontSize: 11,
    marginTop: 2,
  },
  finalValue: {
    fontSize: 22,
    fontWeight: '900',
  },
  subSection: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    marginBottom: 12,
  },
  subSectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
  },
  expenseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  expTitle: {
    fontSize: 11,
    flex: 1,
    marginRight: 8,
  },
  expAmt: {
    fontSize: 11,
    fontWeight: '700',
  },
  reconcileNote: {
    fontSize: 9,
    fontStyle: 'italic',
    marginTop: 6,
  },
  stampCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    marginBottom: 10,
  },
  stampTitle: {
    fontSize: 12,
    fontWeight: '700',
  },
  stampDesc: {
    fontSize: 10,
    marginTop: 2,
  },
  modalFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  shareBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    marginRight: 8,
  },
  shareBtnTxt: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
  closeFooterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  closeFooterBtnTxt: {
    fontSize: 13,
    fontWeight: '600',
  },
});
