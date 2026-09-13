import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from './App';
import type { Produto } from './TelaListaProdutos';

function DetalheProduto({ produto }: { produto: Produto }) {
  return (
      <View style={styles.container}>
        <Image source={produto.imagem} style={styles.imagem} />
        <Text style={styles.nome}>{produto.nome}</Text>
        <Text style={styles.preco}>{produto.preco}</Text>
        <Text style={styles.descricao}>{produto.descricao}</Text>
      </View>
  );
}

type Props = NativeStackScreenProps<RootStackParamList, 'DetalheProduto'> & {
  produtos: Produto[];
};

function TelaDetalheProduto({ route, navigation, produtos }: Props) {
  const produtoId = route.params?.produtoId;
  const produto = produtos.find((item) => item.id === produtoId);

  if (!produto) {
    return (
        <View style={styles.container}>
          <Text style={styles.nome}>Produto não encontrado.</Text>
          <TouchableOpacity style={styles.voltar} onPress={() => navigation.goBack()}>
            <Text style={styles.voltarTexto}>Voltar</Text>
          </TouchableOpacity>
        </View>
    );
  }

  return <DetalheProduto produto={produto} />;
}

export default TelaDetalheProduto;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  imagem: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: 8,
    marginBottom: 16,
  },
  nome: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1B3A5C',
  },
  preco: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2E7D32',
    marginTop: 4,
  },
  descricao: {
    fontSize: 15,
    color: '#4A4A4A',
    marginTop: 12,
    lineHeight: 22,
  },
  voltar: { marginTop: 20, paddingVertical: 12, paddingHorizontal: 16, alignSelf: 'flex-start' },
  voltarTexto: { color: '#1B3A5C', fontWeight: 'bold' },
});