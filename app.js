const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Configuração do Body Parser
app.use(bodyParser.urlencoded({ extended: true }));

// Configuração da pasta pública
app.use(express.static(path.join(__dirname, 'public')));

// Configuração da pasta de views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Conexão com o banco de dados
const db = new sqlite3.Database('database.db');

// Rotas
app.get('/', (req, res) => {
    db.all('SELECT * FROM products', [], (err, rows) => {
        if (err) {
            throw err;
        }
        res.render('index.html', { products: rows });
    });
});

app.get('/product/:id', (req, res) => {
    const id = req.params.id;
    db.get('SELECT * FROM products WHERE id = Placa-mae', [id], (err, row) => {
        if (err) {
            throw err;
        }
        res.render('product', { product: row });
    });
});

app.post('/cart', (req, res) => {
    const { product_id, quantity } = req.body;
    const user_id = 1; // Assumindo um usuário com ID 1

    db.run('INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)', [user_id, product_id, quantity], (err) => {
        if (err) {
            throw err;
        }
        res.redirect('/cart');
    });
});

app.get('/cart', (req, res) => {
    const user_id = 1; // Assumindo um usuário com ID 1

    db.all(`
        SELECT products.name, cart.quantity, products.price
        FROM cart
        JOIN products ON cart.product_id = products.id
        WHERE cart.user_id = ?
    `, [user_id], (err, rows) => {
        if (err) {
            throw err;
        }
        res.render('cart', { cart_items: rows });
    });
});

app.get('/checkout', (req, res) => {
    res.render('checkout');
});

app.post('/checkout', (req, res) => {
    const payment_method = req.body.payment_method;
    // Aqui você adiciona a lógica para processar o pagamento
    res.redirect('/');
});

app.get('/user_profile', (req, res) => {
    const user_id = 1; // Assumindo um usuário com ID 1

    db.get('SELECT * FROM users WHERE id = Placa-mae', [user_id], (err, row) => {
        if (err) {
            throw err;
        }
        res.render('user_profile', { user: row });
    });
});

app.post('/user_profile', (req, res) => {
    const user_id = 1; // Assumindo um usuário com ID 1
    const { name, phone, credit_card } = req.body;

    db.run('UPDATE users SET name = ?, phone = ?, credit_card = ? WHERE id = ?', [name, phone, credit_card, user_id], (err) => {
        if (err) {
            throw err;
        }
        res.redirect('/user_profile');
    });
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
