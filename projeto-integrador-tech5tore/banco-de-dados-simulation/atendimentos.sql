CREATE TABLE Atendimentos (
    id INT IDENTITY(1,1) PRIMARY KEY,
    tipo NVARCHAR(50) NOT NULL,
    mensagem NVARCHAR(255) NOT NULL,
    dataRegistro DATETIME DEFAULT GETDATE()
);

INSERT INTO Atendimentos (tipo, mensagem) VALUES ('Or�amento', 'Solicita��o de or�amento para a compra de um notebook e uma impressora.');

INSERT INTO Atendimentos (tipo, mensagem) VALUES ('D�vidas', 'Tenho d�vidas sobre as especifica��es t�cnicas do produto X.');

INSERT INTO Atendimentos (tipo, mensagem) VALUES ('Sugest�o', 'Gostaria de sugerir a inclus�o de novos produtos no cat�logo da loja.');

INSERT INTO Atendimentos (tipo, mensagem) VALUES ('Cr�ticas', 'Tenho algumas cr�ticas sobre a qualidade do servi�o de entrega.');

INSERT INTO Atendimentos (tipo, mensagem) VALUES ('Suporte', 'Preciso de suporte t�cnico para configurar o novo roteador.');

-- consulta todas as op��es de atendimento 
SELECT * FROM Atendimentos;
-- consulta por tipo de atendimento
SELECT * FROM Atendimentos WHERE tipo = 'D�vidas';



