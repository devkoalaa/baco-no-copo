import { useFonts } from "expo-font";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import { Input, TamaguiProvider, Text, Theme, XStack, YStack } from "tamagui";
import { Button } from "./src/components/Button";
import { ChangeTheme } from "./src/components/ChangeTheme";
import { User } from "./src/components/User";
import config from "./tamagui.config";
import { Plus, Trash } from "@tamagui/lucide-icons";

interface Item {
  nome: string;
  quantidade: number;
}

export default function App() {
  useEffect(() => {
    SecureStore.getItemAsync("BacoNoCopo.itens").then((response) => {
      const resultado = response;
      resultado && setListaItens(JSON.parse(resultado));
    });
  }, []);

  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [loaded] = useFonts({
    Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
    InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
  });

  const [addItem, setAddItem] = useState("");
  const [listaItens, setListaItens] = useState<Item[]>([]);

  useEffect(() => {
    SecureStore.setItemAsync("BacoNoCopo.itens", JSON.stringify(listaItens));
  }, [listaItens]);

  if (!loaded) {
    return null;
  }

  function submitItem() {
    if (addItem) {
      const newItem: Item = { nome: addItem, quantidade: 0 };

      setListaItens([newItem, ...listaItens]);

      console.log("item:", addItem);
      console.log("lista:", listaItens);

      setAddItem("");
    }
  }

  function cleanList() {
    SecureStore.setItemAsync("BacoNoCopo.itens", "");
    setListaItens([]);
  }

  function somaItem(selectedItem: Item) {
    const listaUpdate = listaItens.map((obj) => {
      if (obj.nome == selectedItem.nome) {
        obj.quantidade++;
      }
      return obj;
    });
    setListaItens(listaUpdate);
  }

  return (
    <TamaguiProvider config={config}>
      <Theme name={isDarkTheme ? "dark" : "light"}>
        <YStack bg="$background" f={1} p="$4" pt="$8">
          <XStack jc="flex-start" ai="center">
            <User />
            {/* <ChangeTheme onCheckedChange={setIsDarkTheme} /> */}
          </XStack>
          <XStack space="$2" mt="$6">
            <Input
              keyboardType="default"
              returnKeyType="done"
              f={1}
              w="$5"
              h="$5"
              value={addItem}
              onChangeText={setAddItem}
              placeholder="Adicionar item..."
              focusStyle={{ bw: 2, boc: "$blue10" }}
            />
            <Button icon={Plus} tipo="toxic" onPress={submitItem} />
            <Button icon={Trash} tipo="delete" onPress={cleanList} />
          </XStack>
          {listaItens &&
            listaItens.map((item: Item, index: number) => (
              <YStack
                onPress={() => somaItem(item)}
                key={index}
                p="$4"
                marginVertical="$2"
                backgroundColor="$green10Dark"
                borderRadius="$2"
              >
                <XStack justifyContent="space-between">
                  <Text>{item.nome}</Text>
                  <Text fontWeight="bold">{item.quantidade}</Text>
                </XStack>
              </YStack>
            ))}
        </YStack>
      </Theme>
    </TamaguiProvider>
  );
}
