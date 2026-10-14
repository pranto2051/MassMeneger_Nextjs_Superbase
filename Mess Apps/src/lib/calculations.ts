import { Member, MealEntry, Deposit, Expense, MemberMonthlyStatement, CalculationResult } from '../types';

export function calculateMonthlySettlement(
  members: Member[],
  mealEntries: MealEntry[],
  deposits: Deposit[],
  expenses: Expense[]
): CalculationResult {
  // 1. Calculate Total Meals across all entries
  const totalMeals = mealEntries.reduce((sum, e) => sum + (Number(e.mealCount) || 0), 0);

  // 2. Separate Expenses into Meal-Rate Eligible and Shared Fixed Costs
  let eligibleMealExpenses = 0;
  let fixedSharedExpenses = 0;

  expenses.forEach((exp) => {
    const amt = Number(exp.amount) || 0;
    if (exp.includeInMealRate) {
      eligibleMealExpenses += amt;
    } else {
      fixedSharedExpenses += amt;
    }
  });

  const totalExpenses = eligibleMealExpenses + fixedSharedExpenses;
  const totalDeposits = deposits.reduce((sum, d) => sum + (Number(d.amount) || 0), 0);

  // 3. Compute Meal Rate with zero guard
  const mealRate = totalMeals > 0 ? eligibleMealExpenses / totalMeals : 0;

  // Active members for fixed cost distribution
  const activeMembers = members.filter((m) => m.isActive);
  const fixedPerMember = activeMembers.length > 0 ? fixedSharedExpenses / activeMembers.length : 0;

  // 4. Generate statement per member
  const statements: MemberMonthlyStatement[] = members.map((member) => {
    const memberMeals = mealEntries.filter((e) => e.memberId === member.id);
    
    let breakfastCount = 0;
    let lunchCount = 0;
    let dinnerCount = 0;
    let directTotalCount = 0;

    memberMeals.forEach((e) => {
      const count = Number(e.mealCount) || 0;
      if (e.mealType === 'breakfast') breakfastCount += count;
      else if (e.mealType === 'lunch') lunchCount += count;
      else if (e.mealType === 'dinner') dinnerCount += count;
      else if (e.mealType === 'total') directTotalCount += count;
    });

    const memberTotalMeals = breakfastCount + lunchCount + dinnerCount + directTotalCount;
    const mealCost = memberTotalMeals * mealRate;

    const memberDeposits = deposits
      .filter((d) => d.memberId === member.id)
      .reduce((sum, d) => sum + (Number(d.amount) || 0), 0);

    const individualFixedCharge = member.isActive ? fixedPerMember : 0;

    // Net balance: positive means surplus/credit (mess owes member), negative means due (member owes mess)
    const netBalance = memberDeposits - mealCost - individualFixedCharge;

    return {
      memberId: member.id,
      memberName: member.name,
      roomNo: member.roomNo,
      mobile: member.mobile,
      totalMeals: Number(memberTotalMeals.toFixed(2)),
      breakfastCount: Number(breakfastCount.toFixed(2)),
      lunchCount: Number(lunchCount.toFixed(2)),
      dinnerCount: Number(dinnerCount.toFixed(2)),
      mealCost: Number(mealCost.toFixed(2)),
      totalDeposits: Number(memberDeposits.toFixed(2)),
      individualExpenses: Number(individualFixedCharge.toFixed(2)),
      netBalance: Number(netBalance.toFixed(2)),
    };
  });

  return {
    totalMeals: Number(totalMeals.toFixed(2)),
    eligibleMealExpenses: Number(eligibleMealExpenses.toFixed(2)),
    fixedSharedExpenses: Number(fixedSharedExpenses.toFixed(2)),
    totalExpenses: Number(totalExpenses.toFixed(2)),
    totalDeposits: Number(totalDeposits.toFixed(2)),
    mealRate: Number(mealRate.toFixed(2)),
    statements,
  };
}
