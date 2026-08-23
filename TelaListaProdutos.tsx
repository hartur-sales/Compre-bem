import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

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
        <Text>Qtd: {quantidade}</Text>
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

export default function TelaListaProdutos({ navigation }: Props) {
  return (
    <FlatList
      style={styles.container}
      data={produtosMock}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => (
        <ProdutoItem
          produto={item}
          onPress={() =>
            navigation.navigate('Detalhe', { produtoId: item.id })
          }
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
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
    color: '#1B3A5C',
  },
  categoria: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  preco: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2E7D32',
    marginTop: 4,
  },
});
