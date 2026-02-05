import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [currentUserId, setCurrentUserId] = useState(1);
  const [userBalance, setUserBalance] = useState(0);

  // 残高を更新する関数
  const refreshBalance = async () => {
    try {
      const res = await fetch(`http://localhost:3001/users/${currentUserId}`);
      if (res.ok) {
        const userData = await res.json();
        setUserBalance(userData.balance);
      }
    } catch (err) {
      console.error('残高更新エラー:', err);
    }
  };

  const value = {
    currentUserId,
    setCurrentUserId,
    userBalance,
    setUserBalance,
    refreshBalance // ← 新しく追加
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};