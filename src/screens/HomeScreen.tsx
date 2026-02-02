import React from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView } from 'react-native';

// データの型定義（設計図）
type UserData = {
  userName: string;
  accountNumber: string;
  balance: number;
  iconUrl: string;
};

// ダミーデータ（本来はデータベースから取るやつ）
const dummyUser: UserData = {
  userName: '上田 斉汰',
  accountNumber: '123-4567-89',
  balance: 1254000,
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
};

export default function HomeScreen() {
  // 金額を「¥...」の形式にする
  const formattedBalance = dummyUser.balance.toLocaleString('ja-JP', {
    style: 'currency',
    currency: 'JPY',
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* ①ユーザアイコン & ③ユーザ名 */}
      <View style={styles.header}>
        <Image source={{ uri: dummyUser.iconUrl }} style={styles.icon} />
        <View style={styles.headerText}>
          <Text style={styles.greeting}>こんにちは</Text>
          <Text style={styles.userName}>{dummyUser.userName} 様</Text>
        </View>
      </View>

      {/* ②口座番号 & ④預金残高 */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>普通預金</Text>
          <Text style={styles.accountNumber}>No. {dummyUser.accountNumber}</Text>
        </View>
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>預金残高</Text>
          <Text style={styles.balance}>{formattedBalance}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

// デザイン設定
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    marginTop: 40, // iPhoneのノッチ対策で少し下げる
    backgroundColor: '#fff',
  },
  icon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  headerText: { justifyContent: 'center' },
  greeting: { fontSize: 14, color: '#888' },
  userName: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  card: {
    backgroundColor: '#1E90FF',
    margin: 20,
    padding: 25,
    borderRadius: 15,
    elevation: 5, // Android用の影
    shadowColor: '#000', // iOS用の影
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  cardTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  accountNumber: { color: '#e0e0e0', fontSize: 16 },
  balanceContainer: { alignItems: 'flex-end' },
  balanceLabel: { color: '#e0e0e0', fontSize: 14, marginBottom: 5 },
  balance: { color: '#fff', fontSize: 32, fontWeight: 'bold' },
});
