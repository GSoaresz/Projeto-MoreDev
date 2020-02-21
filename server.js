const express = require("express");
const server = express();
// configurar o server para aprensentar arquivos estáticos
server.use(express.static('public'));
// habilitar body do form
server.use(express.urlencoded({ extended: true}));

// configurar conexão com o BD
const Pool = require("pg").Pool;
const db = new Pool({
  user: 'postgres',
  password:'postgres',
  host:'localhost',
  port: '5432',
  database: 'ProjetoMoreDev'
});
// configurando a template engine
const nunjucks = require("nunjucks");
nunjucks.configure("./", {
  express: server,
  noCache: true
});

// configurar a apresentação da página
server.get("/", function (req, res) {
  db.query(`SELECT * FROM "Donors" LIMIT 5`, function (err, result) {
    if (err) return res.send("Erro no banco de dados.");

    const donors = result.rows;
    return res.render("index.html", { donors });
  });
  
});

server.post("/", function (req, res) {
  // pegar dados do formulário
  const name = req.body.name;
  const email = req.body.email;
  const blood = req.body.blood; // seleciona + ctrl D

  if (name == "" || email == "" || blood == "") {
    return res.send("Todos os campos são obrigatórios!");
  }
  // coloca valores dentro do BD
  const query = `
    INSERT INTO "Donors" ("name", "email", "blood") 
    VALUES ($1, $2, $3)`;

  const values = [name, email, blood];
  db.query(query, values, function (err) {
    if (err) return res.send("Erro no banco de dados.");

    return res.redirect("/");
  });
  
});
// ligar o servidor e permitir o acesso na porta 3000
server.listen(3000, function () {
  console.log("Servidor inicializado");
});
