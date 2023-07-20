import { Image as ImageIcon, Plus, Trash, Minus } from "@tamagui/lucide-icons";
import { useFonts } from "expo-font";
import * as ImagePicker from "expo-image-picker";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import {
  Dialog,
  Image,
  Input,
  TamaguiProvider,
  Text,
  Theme,
  XStack,
  YStack,
} from "tamagui";
import { Button as CustomButton } from "./src/components/Button";
import { User } from "./src/components/User";
import config from "./tamagui.config";
import { set } from "react-native-reanimated";

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

  const [preview, setPreview] = useState("");
  const [addItem, setAddItem] = useState("");
  const [listaItens, setListaItens] = useState<Item[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [openModalItem, setOpenModalItem] = useState(false);
  const [quantidadeItem, setQuantidadeItem] = useState(0);
  const [selectedItem, setSelectedItem] = useState<Item>();

  useEffect(() => {
    SecureStore.getItemAsync("BacoNoCopo.itens").then((response) => {
      const resultado = response;
      resultado && setListaItens(JSON.parse(resultado));
    });
  }, []);

  useEffect(() => {
    setQuantidadeItem(selectedItem?.quantidade || 0);
    setPreview(selectedItem?.imagem || "");
  }, [selectedItem]);

  useEffect(() => {
    SecureStore.setItemAsync("BacoNoCopo.itens", JSON.stringify(listaItens));
  }, [listaItens]);

  if (!loaded) {
    return null;
  }

  function submitItem() {
    if (addItem && preview) {
      const newItem: Item = { nome: addItem, quantidade: 0, imagem: preview };

      setListaItens([newItem, ...listaItens]);

      console.log("Item Add:", addItem);
      console.log("Lista Itens:", listaItens);

      setOpenModal(false);
      setAddItem("");
      setPreview("");
    }
  }

  function cleanList() {
    SecureStore.setItemAsync("BacoNoCopo.itens", "");
    setListaItens([]);
  }

  function somaItem() {
    if (selectedItem) {
      const listaUpdate = listaItens.map((obj) => {
        if (obj.nome == selectedItem.nome) {
          obj.quantidade++;
        }
        return obj;
      });

      setListaItens(listaUpdate);
    }
  }

  function subtraiItem() {
    if (selectedItem) {
      const listaUpdate = listaItens.map((obj) => {
        if (obj.nome == selectedItem.nome) {
          obj.quantidade--;
        }
        return obj;
      });

      setListaItens(listaUpdate);
    }
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

  function Modal() {
    return (
      <Dialog open={openModal}>
        <Dialog.Portal>
          <Dialog.Overlay
            onPress={() => {
              setOpenModal(false), setPreview("");
            }}
          />
          <Dialog.Content>
            <Dialog.Title>
              <Text>Adicionar item</Text>
            </Dialog.Title>
            <Dialog.Description />
            <YStack alignItems="center">
              {preview && (
                <Image
                  margin="$2"
                  borderRadius={1000}
                  source={{ width: 10, height: 10, uri: preview }}
                  width={250}
                  height={250}
                />
              )}
              <XStack space="$2">
                <Input
                  keyboardType="default"
                  returnKeyType="done"
                  f={1}
                  w="$5"
                  h="$5"
                  value={addItem}
                  onChangeText={setAddItem}
                  placeholder="Descrição do item"
                  focusStyle={{ bw: 2, boc: "$blue10" }}
                  marginBottom="$2"
                />
                <CustomButton
                  icon={ImageIcon}
                  tipo="toxic"
                  onPress={openImagePicker}
                />
              </XStack>
              <CustomButton
                width={"100%"}
                icon={Plus}
                tipo="normal"
                onPress={submitItem}
              />
            </YStack>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>
    );
  }

  function ModalItem() {
    return (
      <Dialog open={openModalItem}>
        <Dialog.Portal>
          <Dialog.Overlay onPress={() => setOpenModalItem(false)} />
          <Dialog.Content>
            <Dialog.Title>
              <Text>Alterar quantidade</Text>
            </Dialog.Title>
            <Dialog.Description />
            <YStack alignItems="center" space="$2">
              {preview && (
                <Image
                  margin="$2"
                  borderRadius={1000}
                  source={{ width: 10, height: 10, uri: preview }}
                  width={250}
                  height={250}
                />
              )}
              <CustomButton
                width={"100%"}
                icon={Plus}
                tipo="normal"
                onPress={somaItem}
              />
              <Text fontSize="$10" fontWeight="bold">
                {selectedItem?.quantidade}
              </Text>
              <CustomButton
                width={"100%"}
                icon={Minus}
                tipo="normal"
                onPress={subtraiItem}
              />
            </YStack>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>
    );
  }

  return (
    <TamaguiProvider config={config}>
      <Theme name={"dark"}>
        <YStack bg="$background" f={1} p="$3" pt="$8">
          <XStack jc="space-between" ai="center">
            <User />
            <XStack space={"$2"}>
              <CustomButton icon={Trash} tipo="delete" onPress={cleanList} />
              <CustomButton
                icon={Plus}
                tipo="normal"
                onPress={() => {
                  setOpenModal(true);
                  setPreview("");
                }}
              />
            </XStack>
          </XStack>
          <XStack space="$2" marginVertical="$2" jc="flex-end">
            <Modal />
            <ModalItem />
          </XStack>
          <ScrollView>
            {listaItens &&
              listaItens.map((item: Item, index: number) => (
                <YStack
                  onPress={() => {
                    setSelectedItem(item);
                    setOpenModalItem(true);
                    // setPreview(item.imagem);
                    // setQuantidadeItem(item.quantidade);
                  }}
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
                      borderRadius={1000}
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
