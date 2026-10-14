import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMess } from '../context/MessContext';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export const SwapMarketModal: React.FC<Props> = ({ visible, onClose }) => {
  const { colors, t, filteredMarketAssignments, members, swapAssignments, triggerHaptic } = useMess();

  const [firstId, setFirstId] = useState<string | null>(null);
  const [secondId, setSecondId] = useState<string | null>(null);

  const handleSwap = () => {
    if (!firstId || !secondId) {
      Alert.alert('অদল-বদল করার দুটি শিডিউল বেছে নিন', 'সোয়াপ করার জন্য অন্তত দুটি দায়িত্ব স্লট সিলেক্ট করুন।');
      return;
    }
    if (firstId === secondId) {
      Alert.alert('ভিন্ন দুটি স্লট বেছে নিন', 'একই সদস্যের সাথে অদল-বদল করা সম্ভব নয়।');
      return;
    }

    swapAssignments(firstId, secondId);
    setFirstId(null);
    setSecondId(null);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={[styles.modalBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <View style={styles.headerLeft}>
              <Ionicons name="swap-horizontal" size={20} color={colors.warning} style={{ marginRight: 8 }} />
              <Text style={[styles.headerTitle, { color: colors.text }]}>{t('swapMarket')}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          <Text style={[styles.instruction, { color: colors.textSecondary }]}>
            যে দুটি বাজার শিডিউল অদল-বদল করতে চান তাদের ওপর ট্যাপ করে সিলেক্ট করুন:
          </Text>

          <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
            {filteredMarketAssignments.map((assignment) => {
              const member = members.find((m) => m.id === assignment.memberId);
              const isFirst = firstId === assignment.id;
              const isSecond = secondId === assignment.id;
              const isSelected = isFirst || isSecond;

              return (
                <TouchableOpacity
                  key={assignment.id}
                  style={[
                    styles.itemCard,
                    {
                      backgroundColor: isSelected ? colors.primaryLight + '22' : colors.surfaceSecondary,
                      borderColor: isSelected ? colors.primaryLight : colors.border,
                    },
                  ]}
                  onPress={() => {
                    triggerHaptic();
                    if (isFirst) {
                      setFirstId(null);
                    } else if (isSecond) {
                      setSecondId(null);
                    } else if (!firstId) {
                      setFirstId(assignment.id);
                    } else if (!secondId) {
                      setSecondId(assignment.id);
                    } else {
                      setSecondId(assignment.id);
                    }
                  }}
                >
                  <View style={styles.itemRow}>
                    <View
                      style={[
                        styles.selectBadge,
                        {
                          backgroundColor: isSelected ? colors.primary : 'transparent',
                          borderColor: isSelected ? colors.primary : colors.border,
                        },
                      ]}
                    >
                      {isSelected ? (
                        <Text style={styles.selectBadgeTxt}>{isFirst ? '১' : '২'}</Text>
                      ) : (
                        <Ionicons name="ellipse-outline" size={16} color={colors.textMuted} />
                      )}
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text style={[styles.memberName, { color: colors.text }]}>
                        {member?.name || 'অ্যাসাইনড মেম্বার'}
                      </Text>
                      <Text style={[styles.itemSub, { color: colors.textMuted }]}>
                        {assignment.assignmentDate} {assignment.endDate ? `থেকে ${assignment.endDate}` : ''} •{' '}
                        {assignment.slotLabel}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <View style={[styles.footer, { borderTopColor: colors.border }]}>
            <TouchableOpacity style={[styles.cancelBtn, { borderColor: colors.border }]} onPress={onClose}>
              <Text style={[styles.cancelTxt, { color: colors.textSecondary }]}>{t('cancel')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.swapBtn,
                { backgroundColor: firstId && secondId ? colors.warning : colors.surfaceSecondary },
              ]}
              disabled={!firstId || !secondId}
              onPress={handleSwap}
            >
              <Ionicons name="swap-horizontal" size={18} color="#FFF" style={{ marginRight: 6 }} />
              <Text style={styles.swapTxt}>অদল-বদল সম্পন্ন করুন</Text>
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
  instruction: {
    paddingHorizontal: 18,
    paddingTop: 12,
    fontSize: 12,
  },
  list: {
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  itemCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    marginBottom: 8,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  selectBadgeTxt: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
  },
  memberName: {
    fontSize: 14,
    fontWeight: '700',
  },
  itemSub: {
    fontSize: 11,
    marginTop: 2,
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
  swapBtn: {
    flex: 2,
    flexDirection: 'row',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  swapTxt: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
