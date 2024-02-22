DROP DATABASE IF EXISTS dessert;
CREATE DATABASE dessert;
USE dessert;


CREATE TABLE UserLevels (
    user_level_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL
);


CREATE TABLE Users (
    user_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    user_level_id INT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    FOREIGN KEY (user_level_id) REFERENCES UserLevels(user_level_id)
);

CREATE TABLE Categories (
    category_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    category_name VARCHAR(255)
);

CREATE TABLE Dishes (
    dish_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    dish_price DECIMAL(6,2) NOT NULL,
    dish_name VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    category_id INT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    FOREIGN KEY (category_id) REFERENCES Categories(category_id)
);

CREATE TABLE Offers (
    offer_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    dish_id INT NOT NULL,
    offer_price DECIMAL(6,2) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    FOREIGN KEY (dish_id) REFERENCES Dishes(dish_id)
);

-- payment_status: 'paid' tai 'unpaid'
-- order status: ?
CREATE TABLE Orders (
    order_num INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    total_amount VARCHAR(255),
    payment_status VARCHAR(255),
    order_status VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE OrderTicket (
    ticket_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    order_num INT NOT NULL,
    dish_id INT NOT NULL,
    dish_price DECIMAL(6,2) NOT NULL,
    quantity INT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    FOREIGN KEY (order_num) REFERENCES Orders(order_num),
    FOREIGN KEY (dish_id) REFERENCES Dishes(dish_id)
);

-- Lisää mock data
INSERT INTO UserLevels(name, description)
VALUES ('super admin', 'kaikki oikeus'),
    ('admin', 'admin hallinta paitsi poista/luoda käyttäjä'),
    ('user', 'normaali käyttäjä');

INSERT INTO Users(email, password, user_level_id)
VALUES ('juuso@gmail.com', 'juuso', 2),
    ('sofia@gmail.com', 'sofia1', 3),
    ('jaska@gmail.com', 'jaska1', 3),
    ('simosimo@gmail.com', 'simosimo', 3),
    ('Jakem@gmail.com', 'jakem', 3),
    ('anni@gmail.com', 'juuso', 1);

INSERT INTO Categories(category_name)
VALUES ('juomat'), ('kakut'), ('pullat'), ('jaatelot'), ('kahvit');

INSERT INTO Dishes(dish_name, dish_price, description, category_id)
VALUES('Coca-cola', 3.5, 'Coca-cola', 1),
    ('Fanta', 3.5, 'Fanta', 1),
    ('Kinuskikakku', 4.5, 'Kinuski', 2),
    ('Punainen sametti', 4.0, 'Punainen sametti kakku', 2),
    ('Voisilmäpulla', 2.9, 'Voisilmäpulla', 3),
    ('Korvapuusti', 2.9, 'Korvapuusti', 3),
    ('Dallaspulla', 2.9, 'Dallaspulla', 3),
    ('Pullapitko', 2.9, 'Pullapitko', 3),
    ('Mango-meloni', 3.5, 'Mango-meloni', 4),
    ('Vanilja', 3.5, 'Vanilja', 4),
    ('Suklaa', 3.5, 'Suklaa', 4),
    ('Americano', 3.5, 'Cappuccino', 5),
    ('Latte', 3.5, 'Latte', 5),
    ('Mocha', 3.5, 'Mocha', 5);

--sale: cocacola, kinuskikakku, mango-meloni, americano, latte
INSERT INTO Offers(dish_id, offer_price, start_date, end_date)
VALUES (1, 2.9, '2023-12-1', '2023-12-31'), (3, 2.9, '2023-12-1', '2023-12-31'), (9, 1.9, '2023-12-1', '2023-12-31'), (12, 2.9, '2023-12-1', '2023-12-31'), (13, 2.9, '2023-12-1', '2023-12-31');

INSERT INTO Orders(order_status)
    VALUES(0),(0);

-- order status: ?
INSERT INTO Orders(order_num, user_id, order_status, total_amount, payment_status)
    VALUES(3, 2, 0),(4, 3, 1);

INSERT INTO OrderTicket(order_num, dish_id, dish_price, quantity)
VALUES(1, 1, 3.5, 1), (2, 12, 3.5, 1), (3, 3, 2.9, 1), (3, 11, 3.5, 1), (4, 7, 2.9, 1), (4, 11, 3.5, 1);

-- Kysely
-- Valitse kakki katergoriat
SELECT category_name FROM Categories;


--Valitse kakki tarjouksen annosten nimet, hinnat ja kuvaus
SELECT Dishes.dish_id, Dishes.dish_name, offer_price, description
FROM Dishes, Offers
WHERE Offers.dish_id=Dishes.dish_id;

-- Valitse kaikki annosten nimet ja niiden ajankohtaiset hinnat sekä normaalihinnat, kuvaus
-- järjestys kategorian id:n mukaan
SELECT Dishes.dish_id, dish_name, IFNULL(Offers.offer_price, dish_price) AS current_price, Offers.offer_price, dish_price, description, category_id
FROM Dishes LEFT JOIN Offers
ON Dishes.dish_id = Offers.dish_id
ORDER BY category_id;


-- Käyttäjä tilaa annoksen, jolla id on 4 ????????? TODO: Miten lisää 2 taululle yhtä aika??
INSERT INTO Orders(order_status) VALUES(0);
INSERT INTO OrderTicket(order_num, dish_id, dish_price)
VALUES(5, 4, 4);

-- Päivitä Orders taulua, kun tilaus on valmis
UPDATE Orders
SET order_status=1
WHERE order_num=1;

-- Hallitsija muokkaa annoksen tietoa
UPDATE Dishes
SET dish_name = 'Uusi jäätelö nimi', dish_price = 3.9,
    description = 'Uusi jäätelö', category_id = 4
WHERE dish_id = 11;

-- Muokkaa tarjouksen tietoa:
UPDATE Offers
SET offer_price = 1.9 WHERE dish_id = 1;

-- Poista tarjousannos
DELETE FROM Offers
WHERE dish_id = 1;

INSERT INTO Offers(dish_id, offer_price, start_date, end_date)
VALUES(1, 2.00, '2023-12-07', '2023-12-31');

SELECT Dishes.dish_id, dish_name, Dishes.dish_price, offer_price, description, dish_photo
FROM Offers, Dishes
WHERE Offers.dish_id = Dishes.dish_id;
