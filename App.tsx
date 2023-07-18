import { useFonts } from "expo-font";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import {
  Image,
  Input,
  TamaguiProvider,
  Text,
  Theme,
  XStack,
  YStack,
} from "tamagui";
import { Button } from "./src/components/Button";
import { ChangeTheme } from "./src/components/ChangeTheme";
import { User } from "./src/components/User";
import config from "./tamagui.config";
import { Plus, Trash } from "@tamagui/lucide-icons";
import { ScrollView } from "react-native";

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
        <YStack bg="$background" f={1} p="$3" pt="$8">
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
              marginBottom="$2"
            />
            <Button icon={Plus} tipo="normal" onPress={submitItem} />
            <Button icon={Trash} tipo="delete" onPress={cleanList} />
          </XStack>
          <ScrollView>
            {listaItens &&
              listaItens.map((item: Item, index: number) => (
                <YStack
                  onPress={() => somaItem(item)}
                  key={index}
                  p="$4"
                  marginBottom="$2"
                  backgroundColor="$gray3"
                  borderRadius="$4"
                >
                  <XStack jc="center">
                    <Text
                      fontWeight="bold"
                      marginBottom="$3"
                      alignContent="center"
                    >
                      {item.nome}
                    </Text>
                  </XStack>
                  <XStack jc={"space-between"}>
                    <Image
                      source={require("./assets/petra.png")}
                      w="$10"
                      h="$10"
                    />
                    <YStack jc={"center"}>
                      <Text fontSize="$10" fontWeight="bold">
                        {item.quantidade}
                      </Text>
                    </YStack>
                  </XStack>
                </YStack>
              ))}
          </ScrollView>
        </YStack>
      </Theme>
    </TamaguiProvider>
  );
}
