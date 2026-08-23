import { View, Text, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { produtosMock, type Produto } from './TelaListaProdutos';

type RootStackParamList = {
  Lista: undefined;
  Detalhe: { produtoId: number };
};

type Props = NativeStackScreenProps<RootStackParamList, 'Detalhe'>;

function DetalheProduto({ produto }: { produto: Produto }) {
  return (
    <View style={styles.container}>
      <Text style={styles.nome}>{produto.nome}</Text>
      <Text style={styles.categoria}>{produto.categoria}</Text>
      <Text style={styles.preco}>R$ {produto.preco.toFixed(2)}</Text>
      <Text style={styles.descricao}>{produto.descricao}</Text>
    </View>
  );
}

export default function TelaDetalheProduto({ route }: Props) {
  const { produtoId } = route.params;
  const produto = produtosMock.find((p) => p.id === produtoId);

  if (!produto) {
    return (
      <View style={styles.container}>
        <Text>Produto não encontrado.</Text>
      </View>
    );
  }

  return <DetalheProduto produto={produto} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  nome: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1B3A5C',
  },
  categoria: {
    fontSize: 14,
    color: '#666666',
    marginTop: 8,
  },
  preco: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2E7D32',
    marginTop: 16,
  },
  descricao: {
    fontSize: 14,
    color: '#333333',
    marginTop: 16,
    lineHeight: 22,
  },
});
