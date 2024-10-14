import CategoriaDAO from "../Persistencia/categoriaDAO.js";
import ProdutoDAO from "../Persistencia/produtoDAO.js";
export default class Categoria{
    //atributos privados
    #codigo;
    #descricao;

    get codigo(){
        return this.#codigo;
    }

    set codigo(novoCodigo){
        this.#codigo=novoCodigo;
    } 

    get descricao(){
        return this.#descricao;
    }

    set descricao(novaDescricao){
        this.#descricao = novaDescricao;
    }

    //construtor (criador de um produto)
    constructor(codigo=0, descricao=""){
        this.#codigo=codigo;
        this.#descricao=descricao;         
    }

    //override do método toJSON
    //o método toJSON é chamado automaticamente quando um produto
    //precisar ser convertido no formato JSON
    toJSON(){
        return {
            "codigo":this.#codigo,
            "descricao":this.#descricao,
        }
    }

    async incluir(){
        //instanciar a camada de persistencia do produto
        const catDAO = new CategoriaDAO();
        await catDAO.gravar(this); //this referência a si mesmo
    }

    async consultar(termo){
        const catDAO = new CategoriaDAO();
        return await catDAO.consultar(termo);
    }

    async excluir(){
        const catDAO = new CategoriaDAO();
        await catDAO.excluir(this);
    }

    async alterar(){
        const catDAO = new CategoriaDAO();
        await catDAO.editar(this);
    }
}