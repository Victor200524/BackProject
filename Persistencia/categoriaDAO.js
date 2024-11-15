import conectar from "./Conexao.js";
import Categoria from "../Modelo/categoria.js";

export default class CategoriaDAO{

    constructor(){
        this.init();
    }

    async init(){
        try{
            const conexao = await conectar();
            const sql = `
                CREATE TABLE IF NOT EXISTS categoria(
                    cat_codigo INT NOT NULL AUTO_INCREMENT,
                    cat_descricao VARCHAR(50) NOT NULL,
                    CONSTRAINT pk_categoria PRIMARY KEY(cat_codigo)
                );
            `;
            await conexao.execute(sql);
            await conexao.release();
            //await global.poolConexoes.release(conexao); // LIBERA A CONEXAO ATRAVES DO poolConexoes CHAMADO LA EM conexao.js
        }catch(erro){
            console.log("Erro ao iniciar a tabela categoria!");
        }
    }

    async gravar(categoria){
        if(categoria instanceof Categoria){
            const conexao = conectar();
            const sql = `INSERT INTO categoria(cat_descricao) VALUES (?)`;
            let parametros = [categoria.descricao];
            const resultado = await conexao.release(sql,parametros);
            categoria.codigo = resultado[0].insertId;
            await conexao.release();
        }
    }
    async editar(categoria){
        if(categoria instanceof Categoria){
            const conexao = conectar();
            const sql = `UPDATE categoria SET cat_descricao = ?`;
            let parametros = [categoria.descricao, categoria.codigo];
            await conexao.execute(sql,parametros);
            await conexao.release();
        }
    }
    async excluir(categoria){
        if (categoria instanceof Categoria){
            const conexao = await conectar();
            const sql = "DELETE FROM categoria WHERE cat_codigo = ?";
            const parametros = [categoria.codigo];
            await conexao.execute(sql, parametros);
            await conexao.release();
        }
    }
    async consultar(termo){ 
        let sql = "";
        let parametros = [];
        // aqui estou verificando se aquela categoria realmente existe
        if(isNaN(parseInt(termo))){
            sql = "SELECT * FROM categoria WHERE cat_descricao LIKE ? ORDER BY cat_codigo";
            parametros.push("%"+termo+"%");
        }
        else{
            sql = "SELECT * FROM categoria WHERE cat_codigo = ? ORDER BY cat_codigo";
            parametros.push(termo);
        }
        const conexao = await conectar();
        const [registros, campos] = await conexao.query(sql,parametros); // O METODO QUERY RETORNA UMA LISTA
        let listaCategoria = [];
        for(const registro of registros){ //PARA CADA REGISTRO RECUPERADO CADA UM SE TORNA UMA OARTE DESSE SISTEMA
            const categoria = new Categoria(registro['cat_codigo'],
                                            registro['cat_descricao']
                                        );
            listaCategoria.push(categoria);

        }
        return listaCategoria;
    }
}