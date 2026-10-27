import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import TelaDetalheProduto from './src/screen/TelaDetalheProduto';
import TelaListaProdutos from './src/screen/TelaListaProdutos';
import { cores } from './src/theme';

export type RootStackParamList = {
  TelaListaProdutos: undefined;
  TelaDetalheProduto: { produtoId: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="TelaListaProdutos"
          screenOptions={{
            headerStyle: { backgroundColor: cores.superficie },
            headerTintColor: cores.textoPrimario,
            headerTitleStyle: { fontWeight: '600' },
            headerShadowVisible: false,
            contentStyle: { backgroundColor: cores.fundo },
          }}
        >
          <Stack.Screen
            name="TelaListaProdutos"
            component={TelaListaProdutos}
            options={{ title: 'Lista de Produtos' }}
          />
          <Stack.Screen
            name="TelaDetalheProduto"
            component={TelaDetalheProduto}
            options={{ title: 'Detalhes do produto' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
