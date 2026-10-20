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
  type ImageSourcePropType,
} from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { RootStackParamList } from './App';

const imagemPadrao = require('./assets/icon.png') as ImageSourcePropType;

const CHAVE_FAVORITOS = '@compre_bem:favoritos';
const CHAVE_QUANTIDADES = '@compre_bem:quantidades';

const cores = {
  fundo: '#1C1712',
  superficie: '#2A2119',
  borda: '#4A3B2A',
  destaque: '#7A4E1E',
  textoPrimario: '#F3ECE0',
  textoSecundario: '#B9A88F',
  preco: '#8FB996',
  erro: '#D96C5B',
};

export type Produto = {
  id: number;
  nome: string;
  preco: number;
  categoria: string;
  descricao: string;
  imagem: ImageSourcePropType;
};

export const produtosIniciais: Produto[] = [
  {
    id: 1,
    nome: 'Cadeira Confort Plus',
    preco: 349.9,
    categoria: 'Móveis',
    descricao:
      'Cadeira ergonômica com apoio lombar, ideal para home office.',
    imagem: imagemPadrao,
  },
  {
    id: 2,
    nome: 'Mesa para Escritório',
    preco: 589.0,
    categoria: 'Móveis',
    descricao:
      'Mesa compacta com acabamento em madeira, cabe em espaços pequenos.',
    imagem: imagemPadrao,
  },
  {
    id: 3,
    nome: 'Luminária de Mesa LED',
    preco: 79.9,
    categoria: 'Iluminação',
    descricao:
      'Luminária LED com intensidade ajustável e braço flexível.',
    imagem: imagemPadrao,
  },
  {
    id: 4,
    nome: 'Suporte para Notebook',
    preco: 129.9,
    categoria: 'Acessórios',
    descricao:
      'Suporte ergonômico em alumínio, melhora a ventilação do notebook.',
    imagem: imagemPadrao,
  },
];

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ListaProdutos'>;
  produtos: Produto[];
  onAdicionarProduto: (produto: Produto) => void;
};

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
    <TouchableOpacity
      style={styles.item}
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
          R$ {produto.preco.toFixed(2)}
        </Text>
      </View>

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
    </TouchableOpacity>
  );
}

export default function TelaListaProdutos({
  navigation,
  produtos,
  onAdicionarProduto,
}: Props) {
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [erro, setErro] = useState('');
  const [favoritos, setFavoritos] = useState<number[]>([]);
  const [quantidades, setQuantidades] = useState<Record<number, number>>(
    {}
  );

  const inputPrecoRef = useRef<TextInput>(null);

  useEffect(() => {
    AsyncStorage.getItem(CHAVE_FAVORITOS).then((salvo) => {
      if (salvo) {
        setFavoritos(JSON.parse(salvo));
      }
    });
  }, []);

  useEffect(() => {
    AsyncStorage.getItem(CHAVE_QUANTIDADES).then((salvo) => {
      if (salvo) {
        setQuantidades(JSON.parse(salvo));
      }
    });
  }, []);

  function alternarFavorito(id: number) {
    setFavoritos((atual) => {
      const novo = atual.includes(id)
        ? atual.filter((favId) => favId !== id)
        : [...atual, id];

      AsyncStorage.setItem(
        CHAVE_FAVORITOS,
        JSON.stringify(novo)
      );

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
      );

      return novo;
    });
  }

  function validarESalvar() {
    if (nome.trim() === '') {
      setErro('O nome não pode ficar vazio.');
      return;
    }

    if (preco.trim() === '') {
      setErro('O preço não pode ficar vazio.');
      return;
    }

    const precoNumerico = Number(
      preco.trim().replace(/\./g, '').replace(',', '.')
    );

    if (
      preco.trim() === '' ||
      isNaN(precoNumerico) ||
      precoNumerico <= 0
    ) {
      setErro(
        'O preço precisa ser um número maior que zero (ex.: 89,90).'
      );
      return;
    }

    onAdicionarProduto({
      id: Date.now(),
      nome,
      preco: precoNumerico,
      categoria: 'Geral',
      descricao: 'Produto cadastrado pela equipe da loja.',
      imagem: imagemPadrao,
    });

    setNome('');
    setPreco('');
    setErro('');
    Keyboard.dismiss();
  }

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.listaConteudo}
      data={produtos}
      keyExtractor={(item) => String(item.id)}
      ListHeaderComponent={
        <View style={styles.cadastro}>
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
            navigation.navigate('DetalheProduto', {
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
