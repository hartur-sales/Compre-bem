import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  ImageSourcePropType,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';

import type {
  Produto,
  ProdutoApi,
} from '../types/produto';

import {
  atualizarProduto,
  criarProduto,
  excluirProduto,
  getProdutos,
} from '../service/produto-service';

import { cores } from '../theme';

const imagemPadrao = require('../../assets/icon.png') as ImageSourcePropType;

type Props = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    'TelaListaProdutos'
  >;
};

function converterProduto(produto: ProdutoApi): Produto {
  return {
    ...produto,
    imagem: produto.imagem
      ? { uri: produto.imagem }
      : imagemPadrao,
  };
}

export default function TelaListaProdutos({
  navigation,
}: Props) {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [pagina, setPagina] = useState(0);
  const [ultimaPagina, setUltimaPagina] = useState(false);

  const [carregando, setCarregando] = useState(true);
  const [carregandoMais, setCarregandoMais] = useState(false);
  const [erroApi, setErroApi] = useState('');

  const [textoBusca, setTextoBusca] = useState('');
  const [busca, setBusca] = useState('');

  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [descricao, setDescricao] = useState('');
  const [categoria, setCategoria] = useState('');
  const [quantidade, setQuantidade] = useState('1');

  const [produtoEditando, setProdutoEditando] =
    useState<string | null>(null);

  const [favoritos, setFavoritos] = useState<string[]>([]);

  const carregandoMaisRef = useRef(false);

  useEffect(() => {
    carregarPrimeiraPagina();
  }, [busca]);

  async function carregarPrimeiraPagina() {
    setCarregando(true);
    setErroApi('');
    setPagina(0);
    setUltimaPagina(false);

    try {
      const resposta = await getProdutos(0, busca);

      setProdutos(
        resposta.content.map(converterProduto)
      );

      setUltimaPagina(resposta.last);
    } catch (erro) {
      console.error('Erro ao carregar produtos:', erro);

      setProdutos([]);
      setErroApi(
        erro instanceof Error
          ? erro.message
          : 'Não foi possível carregar os produtos.'
      );
    } finally {
      setCarregando(false);
    }
  }

  async function carregarMaisProdutos() {
    if (
      carregandoMaisRef.current ||
      carregando ||
      ultimaPagina ||
      produtos.length === 0
    ) {
      return;
    }

    carregandoMaisRef.current = true;
    setCarregandoMais(true);

    const proximaPagina = pagina + 1;

    try {
      const resposta = await getProdutos(
        proximaPagina,
        busca
      );

      setProdutos((atual) => [
        ...atual,
        ...resposta.content.map(converterProduto),
      ]);

      setPagina(proximaPagina);
      setUltimaPagina(resposta.last);
    } catch (erro) {
      console.error(
        'Erro ao carregar mais produtos:',
        erro
      );

      setErroApi(
        erro instanceof Error
          ? erro.message
          : 'Não foi possível carregar mais produtos.'
      );
    } finally {
      carregandoMaisRef.current = false;
      setCarregandoMais(false);
    }
  }

  function pesquisar() {
    setBusca(textoBusca.trim());
  }

  function limparFormulario() {
    setNome('');
    setPreco('');
    setDescricao('');
    setCategoria('');
    setQuantidade('1');
    setProdutoEditando(null);
  }

  function iniciarEdicao(produto: Produto) {
    setProdutoEditando(produto.produtoId);
    setNome(produto.nome);
    setPreco(String(produto.preco).replace('.', ','));
    setDescricao(produto.descricao);
    setCategoria(produto.categoria);
    setQuantidade(String(produto.quantidade));
  }

  function converterPreco(valor: string): number {
    return Number(
      valor.trim().replace(',', '.')
    );
  }

  async function salvarProduto() {
    const nomeNormalizado = nome.trim();
    const descricaoNormalizada = descricao.trim();
    const categoriaNormalizada = categoria.trim();
    const precoNumerico = converterPreco(preco);
    const quantidadeNumerica = Number(
      quantidade.trim()
    );

    if (nomeNormalizado === '') {
      setErroApi('Informe o nome do produto.');
      return;
    }

    if (
      !Number.isFinite(precoNumerico) ||
      precoNumerico <= 0
    ) {
      setErroApi(
        'Informe um preço válido maior que zero.'
      );
      return;
    }

    if (descricaoNormalizada === '') {
      setErroApi('Informe a descrição do produto.');
      return;
    }

    if (categoriaNormalizada === '') {
      setErroApi('Informe a categoria do produto.');
      return;
    }

    if (
      !Number.isInteger(quantidadeNumerica) ||
      quantidadeNumerica <= 0
    ) {
      setErroApi(
        'A quantidade deve ser um número inteiro maior que zero.'
      );
      return;
    }

    const produto = {
      nome: nomeNormalizado,
      preco: precoNumerico,
      descricao: descricaoNormalizada,
      categoria: categoriaNormalizada,
      quantidade: quantidadeNumerica,
    };

    try {
      if (produtoEditando) {
        await atualizarProduto(
          produtoEditando,
          produto
        );
      } else {
        await criarProduto(produto);
      }

      limparFormulario();
      Keyboard.dismiss();
      await carregarPrimeiraPagina();
    } catch (erro) {
      console.error('Erro ao salvar produto:', erro);

      setErroApi(
        erro instanceof Error
          ? erro.message
          : 'Não foi possível salvar o produto.'
      );
    }
  }

  function confirmarExclusao(produto: Produto) {
    Alert.alert(
      'Excluir produto',
      `Deseja excluir "${produto.nome}"?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => excluir(produto.produtoId),
        },
      ]
    );
  }

  async function excluir(produtoId: string) {
    try {
      await excluirProduto(produtoId);
      await carregarPrimeiraPagina();
    } catch (erro) {
      console.error('Erro ao excluir produto:', erro);

      setErroApi(
        erro instanceof Error
          ? erro.message
          : 'Não foi possível excluir o produto.'
      );
    }
  }

  function alternarFavorito(produtoId: string) {
    setFavoritos((atual) =>
      atual.includes(produtoId)
        ? atual.filter((id) => id !== produtoId)
        : [...atual, produtoId]
    );
  }

  function renderProduto({ item }: { item: Produto }) {
    return (
      <View style={styles.item}>
        <TouchableOpacity
          style={styles.areaProduto}
          onPress={() =>
            navigation.navigate(
              'TelaDetalheProduto',
              {
                produtoId: item.produtoId,
              }
            )
          }
        >
          <Image
            source={item.imagem}
            style={styles.imagem}
          />

          <View style={styles.informacoes}>
            <Text
              style={styles.nome}
              numberOfLines={1}
            >
              {item.nome}
            </Text>

            <Text style={styles.categoria}>
              {item.categoria}
            </Text>

            <Text style={styles.preco}>
              R$ {item.preco.toFixed(2).replace('.', ',')}
            </Text>

            <Text style={styles.estoque}>
              Estoque: {item.quantidade}
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.acoes}>
          <TouchableOpacity
            onPress={() =>
              alternarFavorito(item.produtoId)
            }
          >
            <Text style={styles.favorito}>
              {favoritos.includes(item.produtoId)
                ? '♥'
                : '♡'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.botaoEditar}
            onPress={() => iniciarEdicao(item)}
          >
            <Text style={styles.textoAcao}>Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.botaoExcluir}
            onPress={() => confirmarExclusao(item)}
          >
            <Text style={styles.textoAcao}>Excluir</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.tela}
      contentContainerStyle={styles.conteudo}
      data={produtos}
      keyExtractor={(item) => item.produtoId}
      renderItem={renderProduto}
      onEndReached={carregarMaisProdutos}
      onEndReachedThreshold={0.5}
      ListHeaderComponent={
        <View style={styles.formulario}>
          <Text style={styles.titulo}>
            Buscar produtos
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Digite o nome do produto"
            value={textoBusca}
            onChangeText={setTextoBusca}
            onSubmitEditing={pesquisar}
            returnKeyType="search"
          />

          <TouchableOpacity
            style={styles.botaoSecundario}
            onPress={pesquisar}
          >
            <Text style={styles.textoBotao}>
              Buscar
            </Text>
          </TouchableOpacity>

          <Text style={styles.titulo}>
            {produtoEditando
              ? 'Editar produto'
              : 'Cadastrar produto'}
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Nome"
            value={nome}
            onChangeText={setNome}
          />

          <TextInput
            style={styles.input}
            placeholder="Preço"
            value={preco}
            onChangeText={setPreco}
            keyboardType="decimal-pad"
          />

          <TextInput
            style={styles.input}
            placeholder="Categoria"
            value={categoria}
            onChangeText={setCategoria}
          />

          <TextInput
            style={styles.input}
            placeholder="Quantidade"
            value={quantidade}
            onChangeText={setQuantidade}
            keyboardType="numeric"
          />

          <TextInput
            style={[
              styles.input,
              styles.inputDescricao,
            ]}
            placeholder="Descrição"
            value={descricao}
            onChangeText={setDescricao}
            multiline
          />

          {erroApi !== '' && (
            <Text style={styles.erro}>
              {erroApi}
            </Text>
          )}

          <TouchableOpacity
            style={styles.botao}
            onPress={salvarProduto}
          >
            <Text style={styles.textoBotao}>
              {produtoEditando
                ? 'Salvar alterações'
                : 'Cadastrar produto'}
            </Text>
          </TouchableOpacity>

          {produtoEditando && (
            <TouchableOpacity
              style={styles.botaoCancelar}
              onPress={limparFormulario}
            >
              <Text style={styles.textoCancelar}>
                Cancelar edição
              </Text>
            </TouchableOpacity>
          )}

          {carregando && (
            <Text style={styles.status}>
              Carregando produtos...
            </Text>
          )}

          {!carregando &&
            produtos.length === 0 &&
            erroApi === '' && (
              <Text style={styles.status}>
                Nenhum produto encontrado.
              </Text>
            )}
        </View>
      }
      ListFooterComponent={
        carregandoMais ? (
          <Text style={styles.status}>
            Carregando mais produtos...
          </Text>
        ) : null
      }
    />
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  conteudo: {
    padding: 16,
  },
  formulario: {
    backgroundColor: cores.superficie,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    gap: 8,
  },
  titulo: {
    color: cores.textoPrimario,
    fontSize: 17,
    fontWeight: '700',
    marginTop: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: cores.textoPrimario,
    backgroundColor: cores.fundo,
  },
  inputDescricao: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  botao: {
    backgroundColor: cores.destaque,
    borderRadius: 10,
    padding: 13,
    alignItems: 'center',
    marginTop: 4,
  },
  botaoSecundario: {
    borderWidth: 1,
    borderColor: cores.destaque,
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  botaoCancelar: {
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  textoBotao: {
    color: cores.textoPrimario,
    fontWeight: '700',
  },
  textoCancelar: {
    color: cores.textoSecundario,
    fontWeight: '600',
  },
  erro: {
    color: cores.erro,
    fontSize: 14,
  },
  status: {
    color: cores.textoSecundario,
    textAlign: 'center',
    padding: 12,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: cores.superficie,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
  },
  areaProduto: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  imagem: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 12,
    backgroundColor: cores.fundo,
  },
  informacoes: {
    flex: 1,
    gap: 2,
  },
  nome: {
    color: cores.textoPrimario,
    fontSize: 16,
    fontWeight: '700',
  },
  categoria: {
    color: cores.textoSecundario,
    fontSize: 13,
  },
  preco: {
    color: cores.preco,
    fontSize: 15,
    fontWeight: '700',
  },
  estoque: {
    color: cores.textoSecundario,
    fontSize: 12,
  },
  acoes: {
    alignItems: 'flex-end',
    gap: 5,
  },
  favorito: {
    color: cores.destaque,
    fontSize: 24,
  },
  botaoEditar: {
    backgroundColor: '#5378A8',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  botaoExcluir: {
    backgroundColor: '#B94A48',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  textoAcao: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
