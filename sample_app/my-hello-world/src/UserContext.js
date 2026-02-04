import React, { createContext, useState, useContext, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // 初期値は localStorage から取得。なければ ID:1
  const [currentUserId, setCurrentUserId] = useState(() => {
    return Number(localStorage.getItem('myId')) || 1;
  });

  // ID が変わるたびに localStorage を更新
  useEffect(() => {
    localStorage.setItem('myId', currentUserId);
  }, [currentUserId]);

  return (
    <UserContext.Provider value={{ currentUserId, setCurrentUserId }}>
      {children}
    </UserContext.Provider>
  );
};

// どの画面からでも簡単に呼び出せるようにするカスタムフック
export const useUser = () => useContext(UserContext);