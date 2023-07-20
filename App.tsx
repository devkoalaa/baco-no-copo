import { Plus, Trash, Image as ImageIcon } from "@tamagui/lucide-icons";
import { useFonts } from "expo-font";
import * as ImagePicker from "expo-image-picker";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native";
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
import { User } from "./src/components/User";
import config from "./tamagui.config";
import { ChangeTheme } from "./src/components/ChangeTheme";
interface Item {
  nome: string;
  quantidade: number;
  imagem: string;
}

export default function App() {
  const [loaded] = useFonts({
    Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
    InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
  });
  const [isDarkTheme, setIsDarkTheme] = useState(true);

  const [preview, setPreview] = useState("");
  const [addItem, setAddItem] = useState("");
  const [listaItens, setListaItens] = useState<Item[]>([]);

  useEffect(() => {
    SecureStore.getItemAsync("BacoNoCopo.itens").then((response) => {
      const resultado = response;
      resultado && setListaItens(JSON.parse(resultado));
    });
  }, []);

  useEffect(() => {
    SecureStore.setItemAsync("BacoNoCopo.itens", JSON.stringify(listaItens));
  }, [listaItens]);

  if (!loaded) {
    return null;
  }

  function submitItem() {
    if (addItem) {
      const newItem: Item = { nome: addItem, quantidade: 0, imagem: preview };

      setListaItens([newItem, ...listaItens]);

      console.log("Item Add:", addItem);
      console.log("Lista Itens:", listaItens);

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

  async function openImagePicker() {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (result.assets) {
        setPreview(result.assets[0].uri);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <TamaguiProvider config={config}>
      <Theme name={isDarkTheme ? "light" : "dark"}>
        <YStack bg="$background" f={1} p="$3" pt="$8">
          <XStack jc="space-between" ai="center">
            <User />
            <ChangeTheme onCheckedChange={setIsDarkTheme} />
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
            <Button icon={ImageIcon} tipo="toxic" onPress={openImagePicker} />
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
                      // source={require("./assets/petra.png")}
                      source={{ width: 10, height: 10, uri: item.imagem }}
                      width={100}
                      height={100}
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
