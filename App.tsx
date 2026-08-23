import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TelaListaProdutos from './TelaListaProdutos';
import TelaDetalheProduto from './TelaDetalheProduto';

export type RootStackParamList = {
  Lista: undefined;
  Detalhe: { produtoId: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Lista">
        <Stack.Screen
          name="Lista"
          component={TelaListaProdutos}
          options={{ title: 'Loja Compre Bem' }}
        />
        <Stack.Screen
          name="Detalhe"
          component={TelaDetalheProduto}
          options={{ title: 'Detalhe do produto' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
