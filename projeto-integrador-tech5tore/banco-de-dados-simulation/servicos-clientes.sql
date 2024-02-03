CREATE TABLE ServicosClientes (
    id INT IDENTITY(1,1) PRIMARY KEY,
    cliente_id INT,
    nomeCliente NVARCHAR(100) NOT NULL,
    dataServico DATE NOT NULL,
    tipoDefeito NVARCHAR(255),
    descricao NVARCHAR(MAX),
    orcamento DECIMAL(10, 2),
    status NVARCHAR(50)
);

-----Entrada do servi�o-----
INSERT INTO ServicosClientes (cliente_id, nomeCliente, dataServico, tipoDefeito, descricao, orcamento, status)
VALUES (
    (SELECT id FROM Clientes WHERE nome = 'Anna Luiza'),
    'Anna Luiza',
    '2024-02-03',
    'Problema de conex�o com a internet',
    'O cliente relatou o Notebook Lenovo V15 Gen 2, com problemas para se conectar � internet. Realizada verifica��o e identificado problema no roteador.',
    150.00,
    'Em andamento'
);

SELECT * FROM ServicosClientes WHERE nomeCliente = 'Anna Luiza';

ALTER TABLE ServicosClientes
ADD saida NVARCHAR(MAX),
    dataSaida DATE;

-----Sa�da do servi�o-----
UPDATE ServicosClientes
SET status = 'Servi�o Conclu�do',
    saida = 'O problema de conex�o com a internet foi resolvido. O roteador foi substitu�do e agora o Notebook Lenovo V15 Gen 2 est� funcionando corretamente.',
    dataSaida = '2024-02-04'
WHERE nomeCliente = 'Anna Luiza';

