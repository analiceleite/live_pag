-- Inserindo métodos de pagamento
INSERT INTO payment_method (name, active) VALUES 
('PIX', TRUE),
('Cartão de Crédito', TRUE),
('Dinheiro', TRUE);

-- Inserindo alguns clientes
INSERT INTO clients (reference_point, address, zip_code, phone, instagram, cpf, name) VALUES
('Próximo ao mercado', 'Rua das Flores, 123', '12345-678', '(11) 91234-5678', '@cliente1', '12345678901', 'Maria Silva'),
('Perto da praça', 'Avenida Brasil, 456', '23456-789', '(21) 99876-5432', '@cliente2', '23456789012', 'João Souza'),
('Em frente à escola', 'Rua do Sol, 789', '34567-890', '(31) 98765-4321', '@cliente3', '34567890123', 'Ana Costa');

-- Inserindo algumas roupas
INSERT INTO clothings (name, price, queue_name, purchase_channel, purchase_type, discount, total_price) VALUES
('Vestido Azul', 120.00, 'Live 01', 'Instagram', 'Novo', 10.00, 110.00),
('Camisa Branca', 80.00, 'Live 01', 'Instagram', 'Usado', 0.00, 80.00),
('Calça Jeans', 100.00, 'Live 02', 'WhatsApp', 'Novo', 5.00, 95.00);

-- Inserindo algumas compras
INSERT INTO purchases (is_paid, is_delivery_asked, is_delivery_sent, is_deleted, tracking_code, client_id, payment_method_id) VALUES
(FALSE, TRUE, FALSE, FALSE, 'TRK123456', 1, 1),
(TRUE, TRUE, TRUE, FALSE, 'TRK654321', 2, 2);

-- Relacionando roupas às compras
INSERT INTO purchase_clothings (purchase_id, clothing_id) VALUES
(1, 1),
(1, 2),
(2, 3);

-- Inserindo mineração de peças
INSERT INTO mining (notes, total_value, quantity) VALUES
('Garimpo de peças na feira de domingo', 300.00, 15),
('Compra em brechó parceiro', 500.00, 20);
