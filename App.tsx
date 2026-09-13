import {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import TelaListaProdutos, {produtosIniciais, type Produto} from './TelaListaProdutos';
import TelaDetalheProduto from './TelaDetalheProduto';

const cores = {
    fundo: '#1C1712',
    superficie: '#2A2119',
    textoPrimario: '#F3ECE0',
};

export type RootStackParamList = {
    ListaProdutos: undefined;
    DetalheProduto: { produtoId: number } | undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
export default function App() {
    const [produtos, setProdutos] = useState<Produto[]>(produtosIniciais);

    function adicionarProduto(produto: Produto) {
        setProdutos((atual) => [...atual, produto]);
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
                    <Stack.Screen name="ListaProdutos" options={{ title: 'Produtos' }}>
                        {(props) => (
                            <TelaListaProdutos {...props} produtos={produtos} onAdicionarProduto={adicionarProduto}/>
                        )}
                    </Stack.Screen>
                    <Stack.Screen name="DetalheProduto" options={{ title: 'Detalhes do produto' }}>
                        {(props) => <TelaDetalheProduto {...props} produtos={produtos} />}
                    </Stack.Screen>
                </Stack.Navigator>
            </NavigationContainer>
        </SafeAreaProvider>
    );
}