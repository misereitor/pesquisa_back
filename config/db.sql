CREATE TABLE IF NOT EXISTS users_vote (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL UNIQUE,
  cpf VARCHAR(14) NOT NULL UNIQUE,
  country VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  city VARCHAR(100) NOT NULL,
  confirmed_vote TINYINT(1) NOT NULL DEFAULT 0,
  try_code_send INT DEFAULT 0,
  confirmed_phone TINYINT(1) NOT NULL DEFAULT 0,
  date_create DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  date_vote DATETIME,
  percentage_vote DECIMAL(5, 2),
  last_ip VARCHAR(45)
);

CREATE TABLE IF NOT EXISTS confirmed_phone (
  id INT AUTO_INCREMENT PRIMARY KEY,
  phone VARCHAR(20) NOT NULL,
  id_user_vote INT NOT NULL,
  expiration_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  code VARCHAR(6),
  FOREIGN KEY (id_user_vote) REFERENCES users_vote (id)
);

CREATE TABLE IF NOT EXISTS users_vote_confirmed_phone_association (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_user_vote INT,
  id_confirmed_phone INT,
  FOREIGN KEY (id_user_vote) REFERENCES users_vote (id),
  FOREIGN KEY (id_confirmed_phone) REFERENCES confirmed_phone (id),
  UNIQUE (id_user_vote, id_confirmed_phone)
);

CREATE TABLE IF NOT EXISTS users_admin (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  username VARCHAR(100) NOT NULL,
  password VARCHAR(250) NOT NULL,
  email VARCHAR(200) NOT NULL,
  role VARCHAR(10) DEFAULT 'admin',
  active TINYINT(1) NOT NULL DEFAULT 1,
  last_ip VARCHAR(45),
  date_create DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS category (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL UNIQUE,
  active TINYINT(1) NOT NULL DEFAULT 1,
  date_create DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS company (
  id INT AUTO_INCREMENT PRIMARY KEY,
  trade_name VARCHAR(250) NOT NULL UNIQUE,
  company_name VARCHAR(250),
  cnpj VARCHAR(14),
  associate TINYINT(1) NOT NULL DEFAULT 0,
  active TINYINT(1) NOT NULL DEFAULT 1,
  date_create DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS category_company_association (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_company INT,
  id_category INT,
  date_create DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_company) REFERENCES company (id),
  FOREIGN KEY (id_category) REFERENCES category (id),
  UNIQUE (id_company, id_category)
);

CREATE TABLE IF NOT EXISTS votes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_category INT,
  id_user_vote INT,
  id_company INT,
  FOREIGN KEY (id_company) REFERENCES company (id),
  FOREIGN KEY (id_category) REFERENCES category (id),
  FOREIGN KEY (id_user_vote) REFERENCES users_vote (id),
  CONSTRAINT unique_user_category_vote UNIQUE (id_user_vote, id_category),
  INDEX idx_vote_report (id_category, id_company)
);

CREATE TABLE IF NOT EXISTS vote_not_confirmed (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_category INT,
  id_user_vote INT,
  id_company INT,
  FOREIGN KEY (id_company) REFERENCES company (id),
  FOREIGN KEY (id_category) REFERENCES category (id),
  FOREIGN KEY (id_user_vote) REFERENCES users_vote (id),
  UNIQUE (id_category, id_user_vote)
);

CREATE TABLE IF NOT EXISTS voting_city (
  id INT AUTO_INCREMENT PRIMARY KEY,
  city VARCHAR(255) NOT NULL UNIQUE,
  total_votes INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS category_votes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_category INT NOT NULL,
  id_company INT NOT NULL,
  total_votes INT NOT NULL DEFAULT 0,
  CONSTRAINT unique_category_company UNIQUE (id_category, id_company),
  FOREIGN KEY (id_category) REFERENCES category(id),
  FOREIGN KEY (id_company) REFERENCES company(id)
);

CREATE TABLE IF NOT EXISTS master_password (
  id INT AUTO_INCREMENT PRIMARY KEY,
  password VARCHAR(255) NOT NULL
);