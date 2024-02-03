CREATE TABLE Atendimentos (
    id INT IDENTITY(1,1) PRIMARY KEY,
    tipo NVARCHAR(50) NOT NULL,
    mensagem NVARCHAR(255) NOT NULL,
    dataRegistro DATETIME DEFAULT GETDATE()
);

INSERT INTO Atendimentos (tipo, mensagem) VALUES ('Orçamento', 'Solicitação de orçamento para a compra de um notebook e uma impressora.');

INSERT INTO Atendimentos (tipo, mensagem) VALUES ('Dúvidas', 'Tenho dúvidas sobre as especificações técnicas do produto X.');

INSERT INTO Atendimentos (tipo, mensagem) VALUES ('Sugestão', 'Gostaria de sugerir a inclusão de novos produtos no catálogo da loja.');

INSERT INTO Atendimentos (tipo, mensagem) VALUES ('Críticas', 'Tenho algumas críticas sobre a qualidade do serviço de entrega.');

INSERT INTO Atendimentos (tipo, mensagem) VALUES ('Suporte', 'Preciso de suporte técnico para configurar o novo roteador.');

-- consulta todas as opções de atendimento 
SELECT * FROM Atendimentos;
-- consulta por tipo de atendimento
SELECT * FROM Atendimentos WHERE tipo = 'Dúvidas';



