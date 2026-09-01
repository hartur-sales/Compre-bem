import { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TelaListaProdutos, { produtosMock, type Produto } from './TelaListaProdutos';
import TelaDetalheProduto from './TelaDetalheProduto';

const cores = {
  fundo: '#150B10',
  textoPrimario: '#F4E3E8',
};

export type RootStackParamList = {
  Lista: undefined;
  Detalhe: { produtoId: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [produtos, setProdutos] = useState<Produto[]>(produtosMock);

  function adicionarProduto(produto: Produto) {
    setProdutos((atual) => [...atual, produto]);
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Lista"
        screenOptions={{
          headerStyle: { backgroundColor: cores.fundo },
          headerTintColor: cores.textoPrimario,
          contentStyle: { backgroundColor: cores.fundo },
        }}
      >
        <Stack.Screen name="Lista" options={{ title: 'Loja Compre Bem' }}>
          {(props) => (
            <TelaListaProdutos
              {...props}
              produtos={produtos}
              onAdicionarProduto={adicionarProduto}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Detalhe" options={{ title: 'Detalhe do produto' }}>
          {(props) => <TelaDetalheProduto {...props} produtos={produtos} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
