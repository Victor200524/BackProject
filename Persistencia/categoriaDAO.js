import conectar from "./Conexao";
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
                    cat_CONSTRAINT pk_categoria PRIMARY KEY(codigo)
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
            const sql = `INSERT INTO categoria(cat_descricao) VALUES ?`;
            const parametros = [categoria.descricao];
            categoria.codigo[0].insertId;
            await conexao.execute(sql,parametros);
            await conexao.release();
        }
    }
    async editar(categoria){
        if(categoria instanceof Categoria){
            const conexao = conectar();
            const sql = `UPDATE categoria SET cat_descricao = ?`;
            const parametros = [categoria.descricao];
            await conexao.execute(sql,parametros);
            await conexao.release();
        }
    }
    async excluir(categoria){
        const conexao = conectar();
        const sql = `DELETE FROM categoria WHERE cat_codigo = ?`;
        const parametros = [categoria.descricao];
        await conexao.execute(sql,parametros);
        await conexao.release();
    }
    async consultar(){
        const conexao = await conectar();
        const sql = "SELECT * FROM categoria ORDER BY descricao";
        await conexao.queery(sql);
        [registros, campos] = await conexao.query(sql); // O METODO QUERY RETORNA UMA LISTA
        await conexao.release();
        let listaCategoria = []
        for(const registro of registros){ //PARA CADA REGISTRO RECUPERADO CADA UM SE TORNA UMA OARTE DESSE SISTEMA
            const categoria = new Categoria(registro['cat_codigo']);
                                            registro['cat_descricao'];
            listaCategoria.push(categoria);

        }
        return listaCategoria;
    }
}