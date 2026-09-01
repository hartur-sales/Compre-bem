import { useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  TouchableOpacity,
  FlatList,
  TextInput,
  Keyboard,
} from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

const cores = {
  fundo: '#150B10',
  borda: '#3D1B2A',
  vinho: '#8E2949',
  textoPrimario: '#F4E3E8',
  textoSecundario: '#C9A9B4',
  preco: '#8FD9A8',
  erro: '#E57373',
};

export type Produto = {
  id: number;
  nome: string;
  preco: number;
  categoria: string;
  descricao: string;
  imagem: string;
};

export const produtosMock: Produto[] = [
  {
    id: 1,
    nome: 'Cadeira Confort Plus',
    preco: 349.9,
    categoria: 'Móveis',
    descricao: 'Cadeira ergonômica com apoio lombar, ideal para home office.',
    imagem: 'https://placehold.co/100x100',
  },
  {
    id: 2,
    nome: 'Mesa para Escritório',
    preco: 589.0,
    categoria: 'Móveis',
    descricao: 'Mesa compacta com acabamento em madeira, cabe em espaços pequenos.',
    imagem: 'https://placehold.co/100x100',
  },
  {
    id: 3,
    nome: 'Luminária de Mesa LED',
    preco: 79.9,
    categoria: 'Iluminação',
    descricao: 'Luminária LED com intensidade ajustável e braço flexível.',
    imagem: 'https://placehold.co/100x100',
  },
  {
    id: 4,
    nome: 'Suporte para Notebook',
    preco: 129.9,
    categoria: 'Acessórios',
    descricao: 'Suporte ergonômico em alumínio, melhora a ventilação do notebook.',
    imagem: 'https://placehold.co/100x100',
  },
];

type RootStackParamList = {
  Lista: undefined;
  Detalhe: { produtoId: number };
};

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Lista'>;
  produtos: Produto[];
  onAdicionarProduto: (produto: Produto) => void;
};

function ProdutoItem({
  produto,
  onPress,
}: {
  produto: Produto;
  onPress: () => void;
}) {
  const [favorito, setFavorito] = useState(false);
  const [quantidade, setQuantidade] = useState(0);

  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <Image source={{ uri: produto.imagem }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.nome}>{produto.nome}</Text>
        <Text style={styles.categoria}>{produto.categoria}</Text>
        <Text style={styles.preco}>R$ {produto.preco.toFixed(2)}</Text>
        <Text style={styles.categoria}>Qtd: {quantidade}</Text>
      </View>
      <View>
        <Button
          title={favorito ? '♥' : '♡'}
          onPress={() => setFavorito(!favorito)}
        />
        <Button title="+" onPress={() => setQuantidade(quantidade + 1)} />
        <Button
          title="-"
          onPress={() => setQuantidade(Math.max(0, quantidade - 1))}
        />
      </View>
    </TouchableOpacity>
  );
}

export default function TelaListaProdutos({ navigation, produtos, onAdicionarProduto }: Props) {
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [erro, setErro] = useState('');
  const inputPrecoRef = useRef<TextInput>(null);

  function validarESalvar() {
    if (nome.trim() === '') {
      setErro('O nome não pode ficar vazio.');
      return;
    }
    const precoNumerico = Number(preco.trim().replace(',', '.'));
    if (preco.trim() === '' || isNaN(precoNumerico) || precoNumerico <= 0) {
      setErro('O preço precisa ser um número maior que zero (ex.: 89,90).');
      return;
    }
    onAdicionarProduto({
      id: Date.now(),
      nome,
      preco: precoNumerico,
      categoria: 'Geral',
      descricao: 'Produto cadastrado pela equipe da loja.',
      imagem: 'https://placehold.co/100x100',
    });
    setNome('');
    setPreco('');
    setErro('');
    Keyboard.dismiss();
  }

  return (
    <FlatList
      style={styles.container}
      data={produtos}
      keyExtractor={(item) => String(item.id)}
      ListHeaderComponent={
        <View style={styles.cadastro}>
          <TextInput
            style={styles.input}
            placeholder="Nome do novo produto"
            placeholderTextColor={cores.textoSecundario}
            value={nome}
            onChangeText={setNome}
            returnKeyType="next"
            onSubmitEditing={() => inputPrecoRef.current?.focus()}
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
          {erro !== '' && <Text style={styles.erro}>{erro}</Text>}
          <TouchableOpacity style={styles.botao} onPress={validarESalvar}>
            <Text style={styles.botaoTexto}>Cadastrar produto</Text>
          </TouchableOpacity>
        </View>
      }
      renderItem={({ item }) => (
        <ProdutoItem
          produto={item}
          onPress={() => navigation.navigate('Detalhe', { produtoId: item.id })}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: cores.fundo,
  },
  cadastro: {
    marginBottom: 20,
    gap: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: cores.textoPrimario,
  },
  erro: {
    color: cores.erro,
  },
  botao: {
    backgroundColor: cores.vinho,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  botaoTexto: {
    color: cores.textoPrimario,
    fontWeight: '600',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: cores.borda,
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 8,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  nome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: cores.textoPrimario,
  },
  categoria: {
    fontSize: 13,
    color: cores.textoSecundario,
    marginTop: 2,
  },
  preco: {
    fontSize: 15,
    fontWeight: '600',
    color: cores.preco,
    marginTop: 4,
  },
});
