import { Image as ImageIcon, Minus, Plus, Trash } from "@tamagui/lucide-icons";
import { useFonts } from "expo-font";
import * as ImagePicker from "expo-image-picker";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import {
  AlertDialog,
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
import { api, imagemDefault } from "./api";

interface Item {
  id?: String;
  name: string;
  quantity: number;
  image?: string;
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
  const [openModalAlert, setOpenModalAlert] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item>();
  let newArrItems: Item[] = [];

  useEffect(() => {
    // SecureStore.getItemAsync("BacoNoCopo.itens").then((response) => {
    //   const resultado = response;
    //   resultado && setListaItens(JSON.parse(resultado));
    // });

    loadItems();
  }, []);

  useEffect(() => {
    setPreview(selectedItem?.image || "");
  }, [selectedItem]);

  // useEffect(() => {
  //   SecureStore.setItemAsync("BacoNoCopo.itens", JSON.stringify(listaItens));
  //   console.log("GALINHAAAAAAAAAAAAAAA:", listaItens);
  // }, [listaItens]);

  if (!loaded) {
    return null;
  }

  async function loadItems() {
    const response = await api.get("/items");

    response.data.map((item: any) => {
      const newItem: Item = {
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        image: item.image,
      };
      newArrItems.push(newItem);
    });

    setListaItens(newArrItems);
  }

  async function submitItem() {
    if (addItem) {
      const response = await api.post("/items", {
        name: addItem,
        image: preview ? preview : imagemDefault,
        quantity: 0,
      });

      const newItem: Item = {
        name: response.data.name,
        quantity: response.data.quantity,
        image: response.data.image,
      };

      newArrItems = listaItens;
      newArrItems.push(newItem);
      setListaItens(newArrItems);
      setOpenModal(false);
      setAddItem("");
      setPreview("");
    }
  }

  async function handleCreateItem() {
    await api.post("/items", {
      name: addItem,
      image: preview ? preview : imagemDefault,
      quantity: 0,
    });
  }

  function cleanList() {
    // SecureStore.setItemAsync("BacoNoCopo.itens", "");
    // setListaItens([]);
  }

  async function somaItem() {
    if (selectedItem) {
      selectedItem.quantity += 1;

      const response = await api.put(`/items/${selectedItem.id}`, {
        quantity: selectedItem.quantity,
      });

      const listaUpdate = listaItens.map((obj) => {
        if (obj.id == selectedItem.id) {
          obj.quantity = response.data.quantity;
        }
        return obj;
      });

      setListaItens(listaUpdate);
    }
  }

  async function subtraiItem() {
    if (selectedItem) {
      selectedItem.quantity -= 1;

      const response = await api.put(`/items/${selectedItem.id}`, {
        quantity: selectedItem.quantity,
      });

      const listaUpdate = listaItens.map((obj) => {
        if (obj.id == selectedItem.id) {
          obj.quantity = response.data.quantity;
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
              setOpenModal(false);
              setPreview("");
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
                  borderRadius="$4"
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
                onPress={() => {
                  submitItem();
                  handleCreateItem();
                }}
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
            <Dialog.Description />
            <YStack alignItems="center" space="$2">
              <Text
                fontWeight="bold"
                marginBottom="$3"
                alignContent="center"
                fontSize={"$8"}
              >
                Editar item
              </Text>
              {preview && (
                <Image
                  margin="$2"
                  borderRadius="$4"
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
                {selectedItem?.quantity}
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

  function ModalAlert() {
    return (
      <AlertDialog open={openModalAlert}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay onPress={() => setOpenModalAlert(false)} />
          <AlertDialog.Content>
            <YStack alignItems="center" space="$2">
              <Text
                fontWeight="bold"
                marginBottom="$3"
                alignContent="center"
                fontSize={"$8"}
              >
                Apagar lista?
              </Text>
              <CustomButton
                marginTop={"$2"}
                width={"100%"}
                tipo="delete"
                icon={Trash}
                onPress={() => {
                  setListaItens([]), setOpenModalAlert(false);
                }}
              >
                Sim
              </CustomButton>
            </YStack>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog>
    );
  }

  return (
    <TamaguiProvider config={config}>
      <Theme name={"dark"}>
        <YStack bg="$background" f={1} p="$3" pt="$8">
          <XStack jc="space-between" ai="center">
            <User />
            <XStack space={"$2"}>
              <CustomButton
                icon={Trash}
                tipo="delete"
                onPress={() => setOpenModalAlert(true)}
              />
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
            <ModalAlert />
          </XStack>
          <ScrollView>
            {listaItens &&
              listaItens.map((item: Item, index: number) => (
                <YStack
                  onPress={() => {
                    setSelectedItem(item);
                    setOpenModalItem(true);
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
                      fontSize={"$8"}
                    >
                      {item.name}
                    </Text>
                  </XStack>
                  <XStack jc={"space-between"}>
                    <Image
                      borderRadius="$4"
                      source={{ width: 10, height: 10, uri: item.image }}
                      width={100}
                      height={100}
                    />
                    <YStack jc={"center"}>
                      <Text fontSize="$10" fontWeight="bold">
                        {item.quantity}
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
