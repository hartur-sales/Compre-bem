import {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import TelaListaProdutos, {produtosIniciais, type Produto} from './TelaListaProdutos';
import TelaDetalheProduto from './TelaDetalheProduto';

const TelaDetalheProdutoCompat = TelaDetalheProduto as any;

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
                <Stack.Navigator initialRouteName="ListaProdutos">
                    <Stack.Screen name="ListaProdutos">
                        {(props) => (
                            <TelaListaProdutos {...props} produtos={produtos} onAdicionarProduto={adicionarProduto}/>
                        )}
                    </Stack.Screen>
                    <Stack.Screen name="DetalheProduto">
                        {(props) => <TelaDetalheProdutoCompat {...props} produtos={produtos} />}
                    </Stack.Screen>
                </Stack.Navigator>
            </NavigationContainer>
        </SafeAreaProvider>
    );
}