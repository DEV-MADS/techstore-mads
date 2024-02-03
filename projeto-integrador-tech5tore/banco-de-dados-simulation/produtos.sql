CREATE TABLE Produtos (
    id INT IDENTITY(1,1) PRIMARY KEY,
    nome NVARCHAR(100) NOT NULL,
    categoria NVARCHAR(50) NOT NULL,
    descricao NVARCHAR(255),
    preco DECIMAL(10, 2) NOT NULL
);

INSERT INTO Produtos (nome, categoria, descricao, preco)
VALUES ('Notebook Lenovo V15 Gen 2', 'notebook', 'Processador Intel Core i5-1135G7 - Tela 15.6, 8GB RAM, 256GB SSD - WIN 11 PRO', 3393.57);

UPDATE Produtos
SET categoria = 'Notebook'
WHERE nome = 'Notebook Lenovo V15 Gen 2';

SELECT * FROM Produtos WHERE nome = 'Notebook Lenovo V15 Gen 2';

INSERT INTO Produtos (nome, categoria, descricao, preco)
VALUES ('Webcam Hoopson SCH-003', 'Câmera','Tela LCD 2'' - 1080p 30fps - 12 Megapixels', 259.47);

SELECT * FROM Produtos WHERE nome = 'Webcam Hoopson SCH-003';

INSERT INTO Produtos (nome, categoria, descricao, preco)
VALUES ('Impressora Fiscal', 'Impressão', 'Térmica Daruma FS700 Mach 1 - Com Serrilha', 1533.57);

SELECT * FROM Produtos WHERE nome = 'Impressora Fiscal';

INSERT INTO Produtos (nome, categoria, descricao, preco)
VALUES ('Leitor Biométrico', 'Leitor Óptico', 'Hamster DX - Interface USB 2.0 - Resolução 500 DPI', 640.77);

SELECT * FROM Produtos WHERE nome = 'Leitor Biométrico';

INSERT INTO Produtos (nome, categoria, descricao, preco)
VALUES ('Notebook Lenovo ThinkPad E14 Gen 3', 'Notebook', 'Processador Ryzen 3 - Tela 14 Full HD - 8GB RAM - 256GB SSD - WIN 11 PRO', 3347.07);

SELECT * FROM Produtos WHERE nome = 'Notebook Lenovo ThinkPad E14 Gen 3';