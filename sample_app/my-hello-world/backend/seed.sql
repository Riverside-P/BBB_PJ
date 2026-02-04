-- 初期データの投入
INSERT INTO users (name, account_number, balance, icon_url) VALUES 
('上田 斉汰', '123-4567-89', 1254000, 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'),
('鈴木 一郎', '987-6543-21', 50000, 'https://cdn-icons-png.flaticon.com/512/3135/3135768.png');

INSERT INTO links (status, requester, payer, amount, comment) VALUES 
(0, 1, 2, 5000, '飲み会代');