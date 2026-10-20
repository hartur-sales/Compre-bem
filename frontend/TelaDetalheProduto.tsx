import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from './App';
import type { Produto } from './TelaListaProdutos';

const cores = {
  fundo: '#1C1712',
  superficie: '#2A2119',
  borda: '#4A3B2A',
  destaque: '#7A4E1E',
  textoPrimario: '#F3ECE0',
  textoSecundario: '#B9A88F',
  preco: '#8FB996',
};

function DetalheProduto({ produto }: { produto: Produto }) {
  return (
      <ScrollView style={styles.tela} contentContainerStyle={styles.container}>
        <Image source={produto.imagem} style={styles.imagem} resizeMode="cover" />
        <View style={styles.cartao}>
          <Text style={styles.nome}>{produto.nome}</Text>
          <Text style={styles.preco}>R$ {produto.preco.toFixed(2)}</Text>
          <Text style={styles.descricao}>{produto.descricao}</Text>
        </View>
      </ScrollView>
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
        <View style={styles.naoEncontrado}>
          <Text style={styles.nome}>Produto não encontrado.</Text>
          <TouchableOpacity style={styles.voltar} onPress={() => navigation.goBack()} activeOpacity={0.85}>
            <Text style={styles.voltarTexto}>Voltar</Text>
          </TouchableOpacity>
        </View>
    );
  }

  return <DetalheProduto produto={produto} />;
}

export default TelaDetalheProduto;

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  container: {
    padding: 16,
  },
  naoEncontrado: {
    flex: 1,
    padding: 16,
    backgroundColor: cores.fundo,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  imagem: {
    width: '100%',
    aspectRatio: 4 / 3,
    maxHeight: 320,
    borderRadius: 16,
    marginBottom: 16,
    backgroundColor: cores.superficie,
  },
  cartao: {
    backgroundColor: cores.superficie,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  nome: {
    fontSize: 22,
    fontWeight: '700',
    color: cores.textoPrimario,
  },
  preco: {
    fontSize: 20,
    fontWeight: '700',
    color: cores.preco,
    marginTop: 4,
  },
  descricao: {
    fontSize: 15,
    color: cores.textoSecundario,
    marginTop: 12,
    lineHeight: 22,
  },
  voltar: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: cores.destaque,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  voltarTexto: {
    color: cores.textoPrimario,
    fontWeight: '700',
  },
});