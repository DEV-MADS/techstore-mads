CREATE TABLE Clientes (
    id INT IDENTITY(1,1) PRIMARY KEY,
    nome NVARCHAR(100) NOT NULL,
    email NVARCHAR(100) UNIQUE,
    telefone NVARCHAR(20)
);

INSERT INTO Clientes (nome, email, telefone)
VALUES ('Marcio Adriano', 'deejaykbello@hotmail.com', '81 98786 6888');

------------------------------------------------------------------------

INSERT INTO Clientes (nome, email, telefone)
VALUES ('Anna Luiza', 'annalu@gmail.com', '81 988885555');

-------------------------------------------------------------------------

INSERT INTO Clientes (nome, email, telefone)
VALUES ('Sophia Paz', 'soph@gmail.com', '81 977756444');


SELECT * FROM Clientes WHERE nome = 'Anna Luiza';

UPDATE Clientes
SET telefone = '81 987866888'
WHERE nome = 'Marcio Adriano';

SELECT * FROM Clientes;
