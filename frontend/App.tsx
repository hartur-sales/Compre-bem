import { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import TelaListaProdutos, {
  produtosIniciais,
  type Produto,
} from './TelaListaProdutos';
import TelaDetalheProduto from './TelaDetalheProduto';

const cores = {
  fundo: '#1C1712',
  superficie: '#2A2119',
  textoPrimario: '#F3ECE0',
};

const API_URL = 'http://localhost:8080/api/v1/produtos';

export type RootStackParamList = {
  ListaProdutos: undefined;
  DetalheProduto: { produtoId: number } | undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

type ProdutoApi = {
  id: number;
  nome: string;
  preco: number;
  descricao: string;
  categoria: string;
  quantidade: number;
  imagem?: string | null;
};

export default function App() {
  const [produtos, setProdutos] = useState<Produto[]>(produtosIniciais);

  useEffect(() => {
    async function carregarProdutos() {
      try {
        const resposta = await fetch(API_URL);

        if (!resposta.ok) {
          throw new Error('Erro ao carregar produtos.');
        }

        const dados: ProdutoApi[] = await resposta.json();

        const produtosConvertidos: Produto[] = dados.map((produto) => ({
          id: produto.id,
          nome: produto.nome,
          preco: produto.preco,
          categoria: produto.categoria,
          descricao: produto.descricao,
          imagem: produto.imagem
            ? { uri: produto.imagem }
            : produtosIniciais[0].imagem,
        }));

        setProdutos(produtosConvertidos);
      } catch (erro) {
        console.error('Não foi possível carregar os produtos da API:', erro);
      }
    }

    carregarProdutos();
  }, []);

  async function adicionarProduto(produto: Produto) {
    const resposta = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nome: produto.nome,
        preco: produto.preco,
        descricao: produto.descricao,
        categoria: produto.categoria,
        quantidade: 1,
      }),
    });

    if (!resposta.ok) {
      throw new Error('Não foi possível cadastrar o produto.');
    }

    const produtoSalvo: ProdutoApi = await resposta.json();

    const produtoConvertido: Produto = {
      id: produtoSalvo.id,
      nome: produtoSalvo.nome,
      preco: produtoSalvo.preco,
      categoria: produtoSalvo.categoria,
      descricao: produtoSalvo.descricao,
      imagem: produtoSalvo.imagem
        ? { uri: produtoSalvo.imagem }
        : produto.imagem,
    };

    setProdutos((atual) => [...atual, produtoConvertido]);
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="ListaProdutos"
          screenOptions={{
            headerStyle: { backgroundColor: cores.superficie },
            headerTintColor: cores.textoPrimario,
            headerTitleStyle: { fontWeight: '600' },
            headerShadowVisible: false,
            contentStyle: { backgroundColor: cores.fundo },
          }}
        >
          <Stack.Screen
            name="ListaProdutos"
            options={{ title: 'Produtos' }}
          >
            {(props) => (
              <TelaListaProdutos
                {...props}
                produtos={produtos}
                onAdicionarProduto={adicionarProduto}
              />
            )}
          </Stack.Screen>

          <Stack.Screen
            name="DetalheProduto"
            options={{ title: 'Detalhes do produto' }}
          >
            {(props) => (
              <TelaDetalheProduto
                {...props}
                produtos={produtos}
              />
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
