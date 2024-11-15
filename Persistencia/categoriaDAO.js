// CategoriaDAO.js

import conectar from "./Conexao.js";
import Categoria from "../Modelo/categoria.js";

export default class CategoriaDAO {
  constructor() {
    this.init();
  }

  async init() {
    try {
      const conexao = await conectar();
      const sql = `
        CREATE TABLE IF NOT EXISTS categoria (
          cat_codigo INT NOT NULL AUTO_INCREMENT,
          cat_descricao VARCHAR(50) NOT NULL,
          CONSTRAINT pk_categoria PRIMARY KEY(cat_codigo)
        );
      `;
      await conexao.execute(sql);  // Corrigido para 'execute'
      await conexao.release();  // Libera a conexão corretamente
    } catch (erro) {
      console.log("Erro ao iniciar a tabela categoria!");
    }
  }

  async gravar(categoria) {
    if (categoria instanceof Categoria) {
      const conexao = await conectar();
      const sql = `INSERT INTO categoria (cat_descricao) VALUES (?)`;
      let parametros = [categoria.descricao];
      const [resultado] = await conexao.execute(sql, parametros);  // Corrigido para 'execute'
      categoria.codigo = resultado.insertId; // Atribui o ID gerado
      await conexao.release();  // Libera a conexão corretamente
    }
  }

  async editar(categoria) {
    if (categoria instanceof Categoria) {
      const conexao = await conectar();
      const sql = `UPDATE categoria SET cat_descricao = ? WHERE cat_codigo = ?`; // Corrigido com 'WHERE'
      let parametros = [categoria.descricao, categoria.codigo];
      await conexao.execute(sql, parametros);  // Corrigido para 'execute'
      await conexao.release();  // Libera a conexão corretamente
    }
  }

  async excluir(categoria) {
    if (categoria instanceof Categoria) {
      const conexao = await conectar();
      const sql = "DELETE FROM categoria WHERE cat_codigo = ?";
      const parametros = [categoria.codigo];
      await conexao.execute(sql, parametros);  // Corrigido para 'execute'
      await conexao.release();  // Libera a conexão corretamente
    }
  }

  async consultar(termo) {
    let sql = "";
    let parametros = [];
    // Verificando se a busca é por descrição ou código
    if (isNaN(parseInt(termo))) {
      sql = "SELECT * FROM categoria WHERE cat_descricao LIKE ? ORDER BY cat_codigo";
      parametros.push("%" + termo + "%");
    } else {
      sql = "SELECT * FROM categoria WHERE cat_codigo = ? ORDER BY cat_codigo";
      parametros.push(termo);
    }
    const conexao = await conectar();
    const [registros] = await conexao.query(sql, parametros); // 'query' agora retorna um array
    let listaCategoria = [];
    for (const registro of registros) {
      const categoria = new Categoria(registro['cat_codigo'], registro['cat_descricao']);
      listaCategoria.push(categoria);
    }
    await conexao.release();  // Libera a conexão corretamente
    return listaCategoria;
  }
}
