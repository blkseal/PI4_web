-- Inserção de um pedido de consulta na tabela
-- Assume-se que existe um utente com id 1 (ou outro id válido)
-- O horário está como texto conforme a imagem
-- status e especialidade não estão na imagem mas podem ser necessários se a tabela real tiver

INSERT INTO pedidos_consulta (id_utente, horario, motivo)
VALUES (1, '9h', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.');

-- Caso a tabela tenha mais campos como data ou status, seria algo assim:
-- INSERT INTO pedidos_consulta (id_utente, data_pedido, horario, motivo, status)
-- VALUES (1, '2025-09-11', '9h', 'Dor de dentes persistente', 'pendente');
