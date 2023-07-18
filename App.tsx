import { useFonts } from "expo-font";
import { Input, TamaguiProvider, Theme, XStack, YStack, Text } from "tamagui";
import { ChangeTheme } from "./src/components/ChangeTheme";
import { User } from "./src/components/User";
import config from "./tamagui.config";
import React, { useEffect, useState } from "react";
import { Button } from "./src/components/Button";
import * as SecureStore from 'expo-secure-store'

interface Item {
  nome: string;
  quantidade: number;
}

export default function App() {
  useEffect(() => {
    SecureStore.getItemAsync('BacoNoCopo.itens').then((response) => {
      const resultado = response
      resultado && setListaItens(JSON.parse(resultado))
    })
  }, [])

  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [loaded] = useFonts({
    Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
    InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
  });

  const [addItem, setAddItem] = useState("")
  const [listaItens, setListaItens] = useState<Item[]>([]);

  useEffect(() => {
    SecureStore.setItemAsync('BacoNoCopo.itens', JSON.stringify(listaItens))
  }, [listaItens])

  if (!loaded) {
    return null;
  }

  function submitItem() {
    if (addItem) {
      const newItem: Item = { nome: addItem, quantidade: 0 };

      setListaItens([newItem, ...listaItens])

      console.log("item:", addItem);
      console.log("lista:", listaItens);

      setAddItem("")
    }
  }

  function somaItem(selectedItem: Item) {

    const listaUpdate = listaItens.map(obj => {

      if (obj.nome == selectedItem.nome) {
        obj.quantidade++;
      }
      return obj;
    })
    setListaItens(listaUpdate)
  }

  return (
    <TamaguiProvider config={config}>
      <Theme name={isDarkTheme ? "dark" : "light"}>
        <YStack bg="$background" f={1} p="$4" pt="$8">
          <XStack jc="space-between" ai="center">
            <User />
            <ChangeTheme onCheckedChange={setIsDarkTheme} />
          </XStack>
          <XStack space="$2" mt="$6">
            <Input
              f={1}
              w="$5"
              h="$5"
              value={addItem}
              onChangeText={setAddItem}
              placeholder="Adicionar item..."
              focusStyle={{ bw: 2, boc: "$blue10" }}
            />
            <Button tipo="normal" onPress={submitItem} />
          </XStack>
          {listaItens && listaItens.map((item: Item, index: number) => (
            <YStack onPress={(e) => somaItem(item)} key={index} p="$4" marginVertical="$2" backgroundColor='$gray10Light' borderRadius='$2'>
              <XStack justifyContent="space-between">
                <Text>
                  {item.nome}
                </Text>
                <Text fontWeight="bold">
                  {item.quantidade}
                </Text>
              </XStack>
            </YStack>
          ))}
        </YStack>
      </Theme>
    </TamaguiProvider>
  );
}
