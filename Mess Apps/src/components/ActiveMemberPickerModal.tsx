import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMess } from '../context/MessContext';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export const ActiveMemberPickerModal: React.FC<Props> = ({ visible, onClose }) => {
  const { colors, t, members, activeMemberId, setActiveMemberId, triggerHaptic } = useMess();

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <View style={[styles.box, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <View style={styles.headerLeft}>
              <Ionicons name="people" size={18} color={colors.primaryLight} style={{ marginRight: 8 }} />
              <Text style={[styles.headerTitle, { color: colors.text }]}>{t('switchMember')}</Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={20} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            মোবাইল অ্যাপ্লিকেশনে কোন সদস্যের প্রোফাইল দেখতে চান তা নির্বাচন করুন:
          </Text>

          <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
            {members.map((m) => {
              const isSelected = m.id === activeMemberId;
              return (
                <TouchableOpacity
                  key={m.id}
                  style={[
                    styles.item,
                    {
                      backgroundColor: isSelected ? colors.primaryLight + '22' : colors.surfaceSecondary,
                      borderColor: isSelected ? colors.primaryLight : colors.border,
                    },
                  ]}
                  onPress={() => {
                    triggerHaptic();
                    setActiveMemberId(m.id);
                    onClose();
                  }}
                >
                  <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
                    <Text style={styles.avatarTxt}>{m.nickname ? m.nickname[0] : m.name[0]}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={[
                        styles.name,
                        { color: isSelected ? colors.primaryLight : colors.text },
                        isSelected && { fontWeight: '700' },
                      ]}
                    >
                      {m.name}
                    </Text>
                    <Text style={[styles.sub, { color: colors.textMuted }]}>
                      রুম {m.roomNo || 'N/A'} • {m.role === 'owner' ? t('roleOwner') : m.role === 'manager' ? t('roleManager') : t('roleMember')}
                    </Text>
                  </View>
                  {isSelected && <Ionicons name="checkmark-circle" size={20} color={colors.primaryLight} />}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  box: {
    width: '100%',
    maxHeight: '75%',
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
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
  subtitle: {
    fontSize: 12,
    marginVertical: 10,
  },
  list: {
    maxHeight: 340,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarTxt: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },
  name: {
    fontSize: 14,
  },
  sub: {
    fontSize: 11,
    marginTop: 2,
  },
});
