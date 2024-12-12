CREATE TABLE 
  IF NOT EXISTS users_vote (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL UNIQUE,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    uf VARCHAR(2) NOT NULL,
    city VARCHAR(100) NOT NULL,
    confirmed_vote BOOLEAN NOT NULL DEFAULT FALSE,
    try_code_send INTEGER DEFAULT 0,
    confirmed_phone BOOLEAN NOT NULL DEFAULT FALSE,
    date_create TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    date_vote TIMESTAMP,
    percentage_vote NUMERIC(5, 2),
    last_ip VARCHAR(15),
    votes JSONB
);

CREATE TABLE
  IF NOT EXISTS confirmed_phone (
    id SERIAL PRIMARY KEY,
    phone VARCHAR(20) NOT NULL,
    id_user_vote INTEGER REFERENCES users_vote (id) NOT NULL, 
    expiration_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    code VARCHAR(6)
);

CREATE TABLE
  IF NOT EXISTS users_vote_confirmed_phone_association (
    id SERIAL PRIMARY KEY,
    id_user_vote INTEGER,
    id_confirmed_phone INTEGER,
    FOREIGN KEY (id_user_vote) REFERENCES users_vote (id),
    FOREIGN KEY (id_confirmed_phone) REFERENCES confirmed_phone (id),
    UNIQUE (id_user_vote, id_confirmed_phone)
);
  
CREATE TABLE
  IF NOT EXISTS users_admin (
    id SERIAL PRIMARY KEY,
		name VARCHAR(200) NOT NULL,
		username VARCHAR(100) NOT NULL,
		password VARCHAR(250) NOT NULL,
		email VARCHAR(200) NOT NULL,
		role VARCHAR(10) DEFAULT 'admin',
    active BOOLEAN NOT NULL DEFAULT TRUE,
    last_ip VARCHAR(15),
    date_create TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE
	IF NOT EXISTS category (
		id SERIAL PRIMARY KEY,
		name VARCHAR(200) NOT NULL UNIQUE,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    date_create TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE
	IF NOT EXISTS company (
		id SERIAL PRIMARY KEY,
		trade_name VARCHAR(250) NOT NULL UNIQUE,
    company_name VARCHAR(250),
		cnpj VARCHAR(14),
		associate BOOLEAN NOT NULL DEFAULT FALSE,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    date_create TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE
	IF NOT EXISTS category_company_association (
		id SERIAL PRIMARY KEY,
		id_company INTEGER,
		id_category INTEGER,
    date_create TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY (id_company) REFERENCES company (id),
		FOREIGN KEY (id_category) REFERENCES category (id),
		UNIQUE (id_company, id_category)
);

CREATE TABLE
	IF NOT EXISTS votes (
		id SERIAL PRIMARY KEY,
		id_category INTEGER,
		id_user_vote INTEGER,
		id_company INTEGER,
    FOREIGN KEY (id_company) REFERENCES company (id),
		FOREIGN KEY (id_category) REFERENCES category (id),
    FOREIGN KEY (Id_user_vote) REFERENCES users_vote (id),
    UNIQUE (id_category, id_user_vote)
);

CREATE TABLE
	IF NOT EXISTS vote_not_confirmed (
		id SERIAL PRIMARY KEY,
		id_category INTEGER,
		id_user_vote INTEGER,
		id_company INTEGER,
    FOREIGN KEY (id_company) REFERENCES company (id),
		FOREIGN KEY (id_category) REFERENCES category (id),
    FOREIGN KEY (Id_user_vote) REFERENCES users_vote (id),
    UNIQUE (id_category, id_user_vote)
);

CREATE TABLE 
  IF NOT EXISTS substitution_dictionary (
    id SERIAL PRIMARY KEY,
    key_word TEXT NOT NULL UNIQUE,
    synonyms TEXT[] NOT NULL
);