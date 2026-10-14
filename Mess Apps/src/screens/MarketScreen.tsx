import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMess } from '../context/MessContext';
import { MarketAssignment } from '../types';

interface Props {
  onOpenAddExpense: () => void;
  onOpenSwapMarket: () => void;
  onOpenAutoGenerate: () => void;
}

export const MarketScreen: React.FC<Props> = ({
  onOpenAddExpense,
  onOpenSwapMarket,
  onOpenAutoGenerate,
}) => {
  const {
    colors,
    t,
    currentMonthLabel,
    members,
    filteredMarketAssignments,
    filteredExpenses,
    todayMarketAssignment,
    updateMarketStatus,
    triggerHaptic,
  } = useMess();

  const handleCall = (phone?: string) => {
    triggerHaptic();
    if (!phone) {
      Alert.alert('নাম্বার নেই', 'এই সদস্যের কোনো মোবাইল নম্বর সংরক্ষিত নেই।');
      return;
    }
    Linking.openURL(`tel:${phone}`);
  };

  const handleWhatsApp = (phone?: string) => {
    triggerHaptic();
    if (!phone) {
      Alert.alert('নাম্বার নেই', 'এই সদস্যের কোনো হোয়াটসঅ্যাপ নম্বর নেই।');
      return;
    }
    const cleanPhone = phone.startsWith('0') ? '88' + phone : phone;
    Linking.openURL(`https://wa.me/${cleanPhone}`);
  };

  const toggleStatus = (assignment: MarketAssignment) => {
    triggerHaptic();
    const nextStatus = assignment.status === 'completed' ? 'assigned' : 'completed';
    updateMarketStatus(assignment.id, nextStatus);
  };

  const marketExpenses = filteredExpenses.filter((e) => e.category === 'market');
  const totalMarketCost = marketExpenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

  const todayMarketMember = todayMarketAssignment
    ? members.find((m) => m.id === todayMarketAssignment.memberId)
    : null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* 1. Today's Market Hero Alert */}
      {todayMarketMember && (
        <View
          style={[
            styles.todayAlertCard,
            {
              backgroundColor: colors.surfaceGlass,
              borderColor: colors.warningBorder,
              shadowColor: colors.cardShadow,
            },
          ]}
        >
          <View style={styles.todayCardTop}>
            <View style={styles.todayTitleLeft}>
              <Ionicons name="cart" size={18} color={colors.warning} style={{ marginRight: 6 }} />
              <Text style={[styles.todayCardTitle, { color: colors.text }]}>{t('todayMarketDuty')}</Text>
            </View>
            <View style={[styles.statusPill, { backgroundColor: colors.warningBg, borderColor: colors.warningBorder }]}>
              <Text style={[styles.statusPillTxt, { color: colors.warning }]}>{t('statusAssigned')}</Text>
            </View>
          </View>

          <View style={styles.todayMemberInfo}>
            <View style={[styles.avatar, { backgroundColor: colors.warning }]}>
              <Text style={styles.avatarTxt}>
                {todayMarketMember.nickname ? todayMarketMember.nickname[0] : todayMarketMember.name[0]}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.todayMemberName, { color: colors.text }]}>{todayMarketMember.name}</Text>
              <Text style={[styles.todayMemberSub, { color: colors.textMuted }]}>
                রুম {todayMarketMember.roomNo || 'N/A'} • {todayMarketAssignment?.slotLabel}
              </Text>
            </View>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.callBtn, { backgroundColor: 'rgba(16, 185, 129, 0.15)', borderColor: colors.successBorder }]}
              onPress={() => handleCall(todayMarketMember.mobile)}
            >
              <Ionicons name="call" size={15} color={colors.success} style={{ marginRight: 6 }} />
              <Text style={[styles.callBtnTxt, { color: colors.success }]}>{t('callNow')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.whatsappBtn, { backgroundColor: 'rgba(34, 197, 94, 0.15)', borderColor: 'rgba(34, 197, 94, 0.35)' }]}
              onPress={() => handleWhatsApp(todayMarketMember.whatsapp || todayMarketMember.mobile)}
            >
              <Ionicons name="logo-whatsapp" size={15} color="#22C55E" style={{ marginRight: 6 }} />
              <Text style={[styles.whatsappBtnTxt, { color: '#22C55E' }]}>{t('whatsapp')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* 2. Market Toolbar */}
      <View style={styles.toolbar}>
        <TouchableOpacity
          style={[styles.primaryActionBtn, { backgroundColor: colors.primary }]}
          onPress={onOpenAddExpense}
          activeOpacity={0.8}
        >
          <Ionicons name="camera-outline" size={17} color="#FFF" style={{ marginRight: 6 }} />
          <Text style={styles.primaryActionTxt}>{t('recordExpense')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.secondaryActionBtn, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}
          onPress={onOpenSwapMarket}
          activeOpacity={0.8}
        >
          <Ionicons name="swap-horizontal" size={16} color={colors.warning} style={{ marginRight: 5 }} />
          <Text style={[styles.secondaryActionTxt, { color: colors.text }]}>{t('swapMarket')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.secondaryActionBtn, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}
          onPress={onOpenAutoGenerate}
          activeOpacity={0.8}
        >
          <Ionicons name="sparkles" size={16} color={colors.primaryLight} style={{ marginRight: 5 }} />
          <Text style={[styles.secondaryActionTxt, { color: colors.text }]}>অটো রোস্টার</Text>
        </TouchableOpacity>
      </View>

      {/* 3. Schedule List Header */}
      <View style={styles.sectionHeaderRow}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {t('scheduleList')} ({currentMonthLabel})
        </Text>
        <Text style={[styles.sectionCount, { color: colors.textMuted }]}>
          {filteredMarketAssignments.length} টি স্লট
        </Text>
      </View>

      {/* Timeline Schedule Cards */}
      {filteredMarketAssignments.map((assignment, idx) => {
        const member = members.find((m) => m.id === assignment.memberId);
        const isCompleted = assignment.status === 'completed';

        return (
          <View
            key={assignment.id}
            style={[
              styles.scheduleCard,
              {
                backgroundColor: colors.surfaceGlass,
                borderColor: isCompleted ? colors.successBorder : colors.border,
                shadowColor: colors.cardShadow,
              },
            ]}
          >
            <View style={styles.scheduleTop}>
              <View style={[styles.slotBadge, { backgroundColor: colors.surfaceSecondary }]}>
                <Ionicons name="calendar-outline" size={13} color={colors.primaryLight} style={{ marginRight: 4 }} />
                <Text style={[styles.slotBadgeTxt, { color: colors.text }]}>
                  {assignment.assignmentDate} {assignment.endDate ? `থেকে ${assignment.endDate}` : ''}
                </Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.statusToggleBtn,
                  {
                    backgroundColor: isCompleted ? colors.successBg : colors.surfaceSecondary,
                    borderColor: isCompleted ? colors.successBorder : colors.border,
                  },
                ]}
                onPress={() => toggleStatus(assignment)}
              >
                <Ionicons
                  name={isCompleted ? 'checkmark-circle' : 'ellipse-outline'}
                  size={14}
                  color={isCompleted ? colors.success : colors.textMuted}
                  style={{ marginRight: 4 }}
                />
                <Text
                  style={[
                    styles.statusToggleTxt,
                    { color: isCompleted ? colors.success : colors.textMuted },
                    isCompleted && { fontWeight: '700' },
                  ]}
                >
                  {isCompleted ? t('statusCompleted') : t('statusAssigned')}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.scheduleBody}>
              <View style={[styles.memberAvatar, { backgroundColor: colors.primary }]}>
                <Text style={styles.memberAvatarTxt}>{member ? member.name[0] : 'M'}</Text>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={[styles.assigneeName, { color: colors.text }]}>{member?.name || 'অ্যাসাইনড'}</Text>
                <Text style={[styles.slotTitle, { color: colors.textSecondary }]}>{assignment.slotLabel}</Text>
                {assignment.note && (
                  <Text style={[styles.slotNote, { color: colors.textMuted }]}>{assignment.note}</Text>
                )}
              </View>

              {/* Call and WhatsApp Icons */}
              {member && (
                <View style={styles.contactIconsGroup}>
                  <TouchableOpacity
                    style={[styles.miniContactBtn, { backgroundColor: colors.surfaceSecondary }]}
                    onPress={() => handleCall(member.mobile)}
                  >
                    <Ionicons name="call-outline" size={16} color={colors.success} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.miniContactBtn, { backgroundColor: colors.surfaceSecondary }]}
                    onPress={() => handleWhatsApp(member.whatsapp || member.mobile)}
                  >
                    <Ionicons name="logo-whatsapp" size={16} color="#22C55E" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        );
      })}

      {/* 4. Month Market Shopping Expenses */}
      <View style={styles.sectionHeaderRow}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          বাজার খরচের তালিকা ও মেমো (মোট ৳{totalMarketCost.toLocaleString()})
        </Text>
      </View>

      {marketExpenses.map((exp) => {
        const buyer = members.find((m) => m.id === exp.paidByMemberId);
        return (
          <View
            key={exp.id}
            style={[styles.expenseCard, { backgroundColor: colors.surfaceGlass, borderColor: colors.border }]}
          >
            <View style={styles.expCardHeader}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={[styles.expTitleTxt, { color: colors.text }]}>{exp.title}</Text>
                <Text style={[styles.expSubTxt, { color: colors.textMuted }]}>
                  {exp.expenseDate} • বাজার করেছেন: <Text style={{ color: colors.primaryLight, fontWeight: '600' }}>{buyer?.name || 'সদস্য'}</Text>
                </Text>
              </View>
              <Text style={[styles.expAmountTxt, { color: colors.danger }]}>৳{exp.amount}</Text>
            </View>

            {exp.receiptPath && (
              <View style={[styles.memoPreviewBox, { borderColor: colors.border }]}>
                <Image source={{ uri: exp.receiptPath }} style={styles.memoImage} resizeMode="cover" />
                <View style={[styles.memoTag, { backgroundColor: 'rgba(0,0,0,0.6)' }]}>
                  <Ionicons name="image-outline" size={12} color="#FFF" style={{ marginRight: 4 }} />
                  <Text style={styles.memoTagTxt}>ভাউচার / মেমোর ছবি সংযুক্ত</Text>
                </View>
              </View>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  todayAlertCard: {
    borderRadius: 20,
    borderWidth: 1.5,
    padding: 16,
    marginBottom: 14,
    elevation: 3,
  },
  todayCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  todayTitleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  todayCardTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
  },
  statusPillTxt: {
    fontSize: 10,
    fontWeight: '700',
  },
  todayMemberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarTxt: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '700',
  },
  todayMemberName: {
    fontSize: 16,
    fontWeight: '700',
  },
  todayMemberSub: {
    fontSize: 12,
    marginTop: 2,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  callBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  callBtnTxt: {
    fontSize: 12,
    fontWeight: '700',
  },
  whatsappBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  whatsappBtnTxt: {
    fontSize: 12,
    fontWeight: '700',
  },
  toolbar: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  primaryActionBtn: {
    flex: 1.3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    borderRadius: 14,
  },
  primaryActionTxt: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  secondaryActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    borderRadius: 14,
    borderWidth: 1,
  },
  secondaryActionTxt: {
    fontSize: 11,
    fontWeight: '600',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  sectionCount: {
    fontSize: 11,
  },
  scheduleCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    marginBottom: 10,
    elevation: 2,
  },
  scheduleTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  slotBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  slotBadgeTxt: {
    fontSize: 11,
    fontWeight: '600',
  },
  statusToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
  },
  statusToggleTxt: {
    fontSize: 11,
  },
  scheduleBody: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  memberAvatarTxt: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },
  assigneeName: {
    fontSize: 14,
    fontWeight: '700',
  },
  slotTitle: {
    fontSize: 12,
    marginTop: 2,
  },
  slotNote: {
    fontSize: 10,
    marginTop: 2,
  },
  contactIconsGroup: {
    flexDirection: 'row',
    gap: 6,
  },
  miniContactBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  expenseCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    marginBottom: 8,
  },
  expCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  expTitleTxt: {
    fontSize: 13,
    fontWeight: '700',
  },
  expSubTxt: {
    fontSize: 11,
    marginTop: 2,
  },
  expAmountTxt: {
    fontSize: 15,
    fontWeight: '800',
  },
  memoPreviewBox: {
    marginTop: 8,
    borderRadius: 10,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  memoImage: {
    width: '100%',
    height: 120,
  },
  memoTag: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  memoTagTxt: {
    color: '#FFF',
    fontSize: 10,
  },
});
