import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { MessProvider, useMess } from './src/context/MessContext';
import { Header } from './src/components/Header';
import { TabBar } from './src/components/TabBar';
import { HomeScreen } from './src/screens/HomeScreen';
import { MealsScreen } from './src/screens/MealsScreen';
import { MarketScreen } from './src/screens/MarketScreen';
import { AccountsScreen } from './src/screens/AccountsScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { MemberAuditSlipModal } from './src/components/MemberAuditSlipModal';
import { AddExpenseModal } from './src/components/AddExpenseModal';
import { AddDepositModal } from './src/components/AddDepositModal';
import { SwapMarketModal } from './src/components/SwapMarketModal';
import { AutoGenerateMarketModal } from './src/components/AutoGenerateMarketModal';
import { AddMemberModal } from './src/components/AddMemberModal';
import { ActiveMemberPickerModal } from './src/components/ActiveMemberPickerModal';
import { MainTabType, MemberMonthlyStatement } from './src/types';

function MainNavigator() {
  const { colors, themeMode, activeMemberStatement } = useMess();
  const [currentTab, setCurrentTab] = useState<MainTabType>('home');

  // Modals state
  const [selectedStatement, setSelectedStatement] = useState<MemberMonthlyStatement | null>(null);
  const [auditSlipVisible, setAuditSlipVisible] = useState(false);
  const [addExpenseVisible, setAddExpenseVisible] = useState(false);
  const [addDepositVisible, setAddDepositVisible] = useState(false);
  const [swapMarketVisible, setSwapMarketVisible] = useState(false);
  const [autoGenVisible, setAutoGenVisible] = useState(false);
  const [addMemberVisible, setAddMemberVisible] = useState(false);
  const [userPickerVisible, setUserPickerVisible] = useState(false);

  const handleOpenMyAuditSlip = () => {
    setSelectedStatement(activeMemberStatement);
    setAuditSlipVisible(true);
  };

  const handleOpenMemberAuditSlip = (statement: MemberMonthlyStatement) => {
    setSelectedStatement(statement);
    setAuditSlipVisible(true);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      <StatusBar style={themeMode === 'dark' ? 'light' : 'dark'} />

      {/* Fluid Header */}
      <Header onOpenUserPicker={() => setUserPickerVisible(true)} />

      {/* Active Tab Screen */}
      <View style={styles.screenContainer}>
        {currentTab === 'home' && (
          <HomeScreen
            onNavigateTab={setCurrentTab}
            onOpenAuditSlip={handleOpenMyAuditSlip}
            onOpenAddExpense={() => setAddExpenseVisible(true)}
            onOpenAddDeposit={() => setAddDepositVisible(true)}
            onOpenSwapMarket={() => setSwapMarketVisible(true)}
          />
        )}

        {currentTab === 'meals' && <MealsScreen />}

        {currentTab === 'market' && (
          <MarketScreen
            onOpenAddExpense={() => setAddExpenseVisible(true)}
            onOpenSwapMarket={() => setSwapMarketVisible(true)}
            onOpenAutoGenerate={() => setAutoGenVisible(true)}
          />
        )}

        {currentTab === 'accounts' && (
          <AccountsScreen
            onOpenAddExpense={() => setAddExpenseVisible(true)}
            onOpenAddDeposit={() => setAddDepositVisible(true)}
            onSelectMemberStatement={handleOpenMemberAuditSlip}
          />
        )}

        {currentTab === 'profile' && (
          <ProfileScreen
            onOpenUserPicker={() => setUserPickerVisible(true)}
            onOpenAddMember={() => setAddMemberVisible(true)}
          />
        )}
      </View>

      {/* Liquid Glass Bottom Navigation Bar */}
      <TabBar currentTab={currentTab} onSelectTab={setCurrentTab} />

      {/* Global Modals & Sheets */}
      <MemberAuditSlipModal
        visible={auditSlipVisible}
        onClose={() => setAuditSlipVisible(false)}
        statement={selectedStatement}
      />

      <AddExpenseModal
        visible={addExpenseVisible}
        onClose={() => setAddExpenseVisible(false)}
      />

      <AddDepositModal
        visible={addDepositVisible}
        onClose={() => setAddDepositVisible(false)}
      />

      <SwapMarketModal
        visible={swapMarketVisible}
        onClose={() => setSwapMarketVisible(false)}
      />

      <AutoGenerateMarketModal
        visible={autoGenVisible}
        onClose={() => setAutoGenVisible(false)}
      />

      <AddMemberModal
        visible={addMemberVisible}
        onClose={() => setAddMemberVisible(false)}
      />

      <ActiveMemberPickerModal
        visible={userPickerVisible}
        onClose={() => setUserPickerVisible(false)}
      />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <MessProvider>
        <MainNavigator />
      </MessProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  screenContainer: {
    flex: 1,
  },
});
