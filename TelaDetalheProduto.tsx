import { View, Text, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { Produto } from './TelaListaProdutos';

const cores = {
  fundo: '#150B10',
  vinho: '#8E2949',
  textoPrimario: '#F4E3E8',
  textoSecundario: '#C9A9B4',
  preco: '#8FD9A8',
};

type RootStackParamList = {
  Lista: undefined;
  Detalhe: { produtoId: number };
};

type Props = NativeStackScreenProps<RootStackParamList, 'Detalhe'> & {
  produtos: Produto[];
};

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

export default function TelaDetalheProduto({ route, produtos }: Props) {
  const { produtoId } = route.params;
  const produto = produtos.find((p) => p.id === produtoId);

  if (!produto) {
    return (
      <View style={styles.container}>
        <Text style={styles.nome}>Produto não encontrado.</Text>
      </View>
    );
  }

  return <DetalheProduto produto={produto} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: cores.fundo,
  },
  nome: {
    fontSize: 22,
    fontWeight: 'bold',
    color: cores.textoPrimario,
  },
  categoria: {
    fontSize: 14,
    color: cores.textoSecundario,
    marginTop: 8,
  },
  preco: {
    fontSize: 18,
    fontWeight: '600',
    color: cores.preco,
    marginTop: 16,
  },
  descricao: {
    fontSize: 14,
    color: cores.textoPrimario,
    marginTop: 16,
    lineHeight: 22,
  },
});
