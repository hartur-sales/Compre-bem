import { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  TextInput,
  Keyboard,
  Alert,
  type ImageSourcePropType,
  type TextInputInstance,
} from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { RootStackParamList } from '../../App';
import type {
  Produto,
  ProdutoApi,
} from '../types/produto';
import {
  criarProduto,
  getProdutos,
} from '../service/produto-service';
import { cores } from '../theme';

const CHAVE_FAVORITOS = '@compre_bem:favoritos';
const CHAVE_QUANTIDADES = '@compre_bem:quantidades';
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

function ProdutoItem({
  produto,
  onPress,
  favorito,
  onAlternarFavorito,
  quantidade,
  onAlterarQuantidade,
}: {
  produto: Produto;
  onPress: () => void;
  favorito: boolean;
  onAlternarFavorito: () => void;
  quantidade: number;
  onAlterarQuantidade: (novaQuantidade: number) => void;
}) {
  return (
    <View style={styles.item}>
      <TouchableOpacity
        style={styles.areaProduto}
        onPress={onPress}
        activeOpacity={0.85}
      >
        <Image source={produto.imagem} style={styles.image} />

        <View style={styles.info}>
          <Text style={styles.nome} numberOfLines={1}>
            {produto.nome}
          </Text>

          <Text style={styles.categoria}>
            {produto.categoria}
          </Text>

          <Text style={styles.preco}>
            R$ {produto.preco.toFixed(2).replace('.', ',')}
          </Text>
        </View>
      </TouchableOpacity>

      <View style={styles.acoes}>
        <TouchableOpacity
          style={styles.botaoFavorito}
          onPress={onAlternarFavorito}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text
            style={[
              styles.favoritoTexto,
              favorito && styles.favoritoAtivo,
            ]}
          >
            {favorito ? '♥' : '♡'}
          </Text>
        </TouchableOpacity>

        <View style={styles.stepper}>
          <TouchableOpacity
            style={styles.stepperBotao}
            onPress={() =>
              onAlterarQuantidade(Math.max(0, quantidade - 1))
            }
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          >
            <Text style={styles.stepperTexto}>−</Text>
          </TouchableOpacity>

          <Text style={styles.stepperValor}>
            {quantidade}
          </Text>

          <TouchableOpacity
            style={styles.stepperBotao}
            onPress={() =>
              onAlterarQuantidade(quantidade + 1)
            }
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          >
            <Text style={styles.stepperTexto}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default function TelaListaProdutos({
  navigation,
}: Props) {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [pagina, setPagina] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [carregando, setCarregando] = useState(true);
  const [erroApi, setErroApi] = useState('');
  const [versaoProdutos, setVersaoProdutos] = useState(0);
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [descricao, setDescricao] = useState('');
  const [categoria, setCategoria] = useState('');
  const [busca, setBusca] = useState('');
  const [erro, setErro] = useState('');
  const [favoritos, setFavoritos] = useState<number[]>([]);
  const [quantidades, setQuantidades] = useState<Record<number, number>>(
    {}
  );

  const inputPrecoRef = useRef<TextInputInstance>(null);

  useEffect(() => {
    async function carregarProdutos() {
      setCarregando(true);
      setErroApi('');

      try {
        const dados = await getProdutos(pagina, busca);
        setProdutos(dados.content.map(converterProduto));
        setTotalPaginas(dados.totalPages);
      } catch (erro) {
        console.error('Não foi possível carregar os produtos:', erro);
        setErroApi('Não foi possível carregar os produtos.');
      } finally {
        setCarregando(false);
      }
    }

    carregarProdutos();
  }, [pagina, busca, versaoProdutos]);

  useEffect(() => {
    async function carregarFavoritos() {
      try {
        const salvo = await AsyncStorage.getItem(CHAVE_FAVORITOS);

        if (salvo) {
          setFavoritos(JSON.parse(salvo));
        }
      } catch (erro) {
        console.error('Erro ao carregar favoritos:', erro);
      }
    }

    carregarFavoritos();
  }, []);

  useEffect(() => {
    async function carregarQuantidades() {
      try {
        const salvo = await AsyncStorage.getItem(CHAVE_QUANTIDADES);

        if (salvo) {
          setQuantidades(JSON.parse(salvo));
        }
      } catch (erro) {
        console.error('Erro ao carregar quantidades:', erro);
      }
    }

    carregarQuantidades();
  }, []);

  function alternarFavorito(id: number) {
    setFavoritos((atual) => {
      const novo = atual.includes(id)
        ? atual.filter((favId) => favId !== id)
        : [...atual, id];

      AsyncStorage.setItem(
        CHAVE_FAVORITOS,
        JSON.stringify(novo)
      ).catch((erro) => {
        console.error('Erro ao salvar favoritos:', erro);
      });

      return novo;
    });
  }

  function alterarQuantidade(
    id: number,
    novaQuantidade: number
  ) {
    setQuantidades((atual) => {
      const novo = {
        ...atual,
        [id]: novaQuantidade,
      };

      AsyncStorage.setItem(
        CHAVE_QUANTIDADES,
        JSON.stringify(novo)
      ).catch((erro) => {
        console.error('Erro ao salvar quantidades:', erro);
      });

      return novo;
    });
  }

  function pesquisar(novaBusca: string) {
    setBusca(novaBusca);
    setPagina(0);
  }

  async function validarESalvar() {
    const nomeNormalizado = nome.trim();
    const precoNormalizado = preco.trim();

    if (nomeNormalizado === '') {
      setErro('O nome não pode ficar vazio.');
      return;
    }

    if (precoNormalizado === '') {
      setErro('O preço não pode ficar vazio.');
      return;
    }

    const precoNumerico = Number(
      precoNormalizado.replace(/\./g, '').replace(',', '.')
    );

    if (
      Number.isNaN(precoNumerico) ||
      !Number.isFinite(precoNumerico) ||
      precoNumerico <= 0
    ) {
      setErro(
        'O preço precisa ser um número maior que zero (ex.: 89,90).'
      );
      return;
    }

    const descricaoNormalizada = descricao.trim();
    const categoriaNormalizada = categoria.trim();

    if (descricaoNormalizada === '' || categoriaNormalizada === '') {
      setErro('Preencha a descrição e a categoria.');
      return;
    }

    try {
      await criarProduto({
        nome: nomeNormalizado,
        preco: precoNumerico,
        categoria: categoriaNormalizada,
        descricao: descricaoNormalizada,
        quantidade: 1,
      });

      setPagina(0);
      setVersaoProdutos((atual) => atual + 1);
      setNome('');
      setPreco('');
      setDescricao('');
      setCategoria('');
      setErro('');
      Keyboard.dismiss();
    } catch (erro) {
      console.error('Erro ao cadastrar produto:', erro);
      setErro('Não foi possível cadastrar o produto.');
      Alert.alert(
        'Erro',
        'Não foi possível cadastrar o produto no servidor.'
      );
    }
  }

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.listaConteudo}
      data={produtos}
      keyExtractor={(item) => String(item.id)}
      ListHeaderComponent={
        <View style={styles.cadastro}>
          <TextInput
            style={styles.input}
            placeholder="Buscar produtos"
            placeholderTextColor={cores.textoSecundario}
            value={busca}
            onChangeText={setBusca}
            onSubmitEditing={() => pesquisar(busca)}
            returnKeyType="search"
          />

          <TouchableOpacity
            style={styles.botaoSecundario}
            onPress={() => pesquisar(busca)}
            activeOpacity={0.85}
          >
            <Text style={styles.botaoTexto}>Buscar</Text>
          </TouchableOpacity>

          <Text style={styles.cadastroTitulo}>
            Novo produto
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Nome do novo produto"
            placeholderTextColor={cores.textoSecundario}
            value={nome}
            onChangeText={setNome}
            returnKeyType="next"
            onSubmitEditing={() =>
              inputPrecoRef.current?.focus()
            }
          />

          <TextInput
            ref={inputPrecoRef}
            style={styles.input}
            placeholder="Preço (ex.: 89,90)"
            placeholderTextColor={cores.textoSecundario}
            value={preco}
            onChangeText={setPreco}
            keyboardType="decimal-pad"
            returnKeyType="done"
            onSubmitEditing={validarESalvar}
          />

          <TextInput
            style={styles.input}
            placeholder="Categoria"
            placeholderTextColor={cores.textoSecundario}
            value={categoria}
            onChangeText={setCategoria}
          />

          <TextInput
            style={[styles.input, styles.inputMultiline]}
            placeholder="Descrição"
            placeholderTextColor={cores.textoSecundario}
            value={descricao}
            onChangeText={setDescricao}
            multiline
          />

          {erro !== '' && (
            <Text style={styles.erro}>{erro}</Text>
          )}

          <TouchableOpacity
            style={styles.botao}
            onPress={validarESalvar}
            activeOpacity={0.85}
          >
            <Text style={styles.botaoTexto}>
              Cadastrar produto
            </Text>
          </TouchableOpacity>

          {carregando && (
            <Text style={styles.status}>Carregando produtos...</Text>
          )}

          {erroApi !== '' && (
            <Text style={styles.erro}>{erroApi}</Text>
          )}

          {!carregando && produtos.length === 0 && erroApi === '' && (
            <Text style={styles.status}>Nenhum produto encontrado.</Text>
          )}

          {totalPaginas > 1 && (
            <View style={styles.paginacao}>
              <TouchableOpacity
                disabled={pagina === 0}
                onPress={() => setPagina(pagina - 1)}
              >
                <Text
                  style={[
                    styles.paginacaoTexto,
                    pagina === 0 && styles.paginacaoDesabilitada,
                  ]}
                >
                  Anterior
                </Text>
              </TouchableOpacity>

              <Text style={styles.status}>
                Página {pagina + 1} de {totalPaginas}
              </Text>

              <TouchableOpacity
                disabled={pagina >= totalPaginas - 1}
                onPress={() => setPagina(pagina + 1)}
              >
                <Text
                  style={[
                    styles.paginacaoTexto,
                    pagina >= totalPaginas - 1 &&
                      styles.paginacaoDesabilitada,
                  ]}
                >
                  Próxima
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      }
      renderItem={({ item }) => (
        <ProdutoItem
          produto={item}
          favorito={favoritos.includes(item.id)}
          onAlternarFavorito={() =>
            alternarFavorito(item.id)
          }
          quantidade={quantidades[item.id] ?? 0}
          onAlterarQuantidade={(novaQuantidade) =>
            alterarQuantidade(item.id, novaQuantidade)
          }
          onPress={() =>
            navigation.navigate('TelaDetalheProduto', {
              produtoId: item.id,
            })
          }
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  listaConteudo: {
    padding: 16,
  },
  cadastro: {
    backgroundColor: cores.superficie,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    gap: 8,
  },
  cadastroTitulo: {
    fontSize: 16,
    fontWeight: '700',
    color: cores.textoPrimario,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: cores.textoPrimario,
    backgroundColor: cores.fundo,
  },
  inputMultiline: {
    minHeight: 72,
    textAlignVertical: 'top',
  },
  botaoSecundario: {
    borderWidth: 1,
    borderColor: cores.destaque,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  status: {
    color: cores.textoSecundario,
    textAlign: 'center',
    fontSize: 13,
  },
  paginacao: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  paginacaoTexto: {
    color: cores.textoPrimario,
    fontWeight: '700',
  },
  paginacaoDesabilitada: {
    color: cores.textoSecundario,
  },
  erro: {
    color: cores.erro,
    fontSize: 13,
  },
  botao: {
    backgroundColor: cores.destaque,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  botaoTexto: {
    color: cores.textoPrimario,
    fontWeight: '600',
    fontSize: 15,
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
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  areaProduto: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 72,
    height: 72,
    borderRadius: 10,
    marginRight: 12,
    backgroundColor: cores.fundo,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  nome: {
    fontSize: 16,
    fontWeight: '700',
    color: cores.textoPrimario,
  },
  categoria: {
    fontSize: 13,
    color: cores.textoSecundario,
  },
  preco: {
    fontSize: 15,
    fontWeight: '700',
    color: cores.preco,
    marginTop: 2,
  },
  acoes: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 72,
    marginLeft: 8,
  },
  botaoFavorito: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoritoTexto: {
    fontSize: 20,
    color: cores.textoSecundario,
  },
  favoritoAtivo: {
    color: cores.destaque,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: cores.fundo,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 999,
    paddingHorizontal: 2,
  },
  stepperBotao: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperTexto: {
    fontSize: 16,
    fontWeight: '700',
    color: cores.textoPrimario,
  },
  stepperValor: {
    minWidth: 20,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '600',
    color: cores.textoPrimario,
  },
});
