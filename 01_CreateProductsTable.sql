IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'SmartInventoryDB')
BEGIN
    CREATE DATABASE SmartInventoryDB;
END;
GO

USE SmartInventoryDB;
GO

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Products]') AND type in (N'U'))
BEGIN
    CREATE TABLE Products (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        Name NVARCHAR(100) NOT NULL,
        Category NVARCHAR(50) NOT NULL,
        Price DECIMAL(18,2) NOT NULL,
        Stock INT NOT NULL,
        Status NVARCHAR(20) NOT NULL,
        CreatedAt DATETIME DEFAULT GETDATE()
    );
END;
GO

INSERT INTO Products (Name, Category, Price, Stock, Status)
VALUES 
('Wireless Ergonomic Mouse', 'Electronics', 29.99, 42, 'In Stock'),
('Mechanical Gaming Keyboard', 'Electronics', 79.99, 3, 'Low Stock'),
('Stainless Steel Water Bottle', 'Home & Kitchen', 15.50, 0, 'Out of Stock');
GO