CREATE TABLE PedidosCompra (
    id INT IDENTITY(1,1) PRIMARY KEY,
    dataPedido DATE NOT NULL,
    cliente NVARCHAR(20) NOT NULL,
    produto NVARCHAR(100) NOT NULL,
    quantidade INT NOT NULL,
	fornecedor NVARCHAR(100) NOT NULL,
    precoUnitario DECIMAL(10, 2) NOT NULL,
    total DECIMAL(10, 2) NOT NULL
);

INSERT INTO PedidosCompra (dataPedido, cliente, produto, quantidade, fornecedor, precoUnitario, total)
VALUES ('2024-01-30', 'Anna Luiza', 'Notebook Lenovo V15 Gen 2', 5,'Fornecedor XYZ', 3393.57, 16967.85);

SELECT *
FROM PedidosCompra
WHERE id = 1;

INSERT INTO PedidosCompra (dataPedido, cliente, produto, quantidade, fornecedor, precoUnitario, total)
VALUES ('2024-01-30', 'Marcio Adriano', 'Webcam Hoopson SCH-003', 1,'Fornecedor ABC', 259.47, 259.47);

SELECT *
FROM PedidosCompra
WHERE id = 2;

INSERT INTO PedidosCompra (dataPedido, cliente, produto, quantidade, fornecedor, precoUnitario, total)
VALUES ('2024-01-30', 'Sophia Paz', 'Impressora Fiscal', 1,'Fornecedor XYZ', 1533.57, 1533.57);

SELECT *
FROM PedidosCompra
WHERE id = 3;

INSERT INTO PedidosCompra (dataPedido, cliente, produto, quantidade, fornecedor, precoUnitario, total)
VALUES ('2024-01-30', 'Anna Luiza', 'Leitor Biométrico', 1,'Fornecedor ABC', 640.77, 640.77);

SELECT *
FROM PedidosCompra
WHERE id = 4;

INSERT INTO PedidosCompra (dataPedido, cliente, produto, quantidade, fornecedor, precoUnitario, total)
VALUES ('2024-01-30', 'Marcio Adriano', 'Notebook Lenovo ThinkPad E14 Gen 3', 1,'Fornecedor XYZ', 3347.07, 3347.07);

SELECT *
FROM PedidosCompra
WHERE id = 5;