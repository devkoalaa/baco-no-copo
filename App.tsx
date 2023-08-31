import { Image as ImageIcon, Minus, Plus, Trash } from "@tamagui/lucide-icons";
import { useFonts } from "expo-font";
import * as ImagePicker from "expo-image-picker";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import { ScrollView, TouchableOpacity } from "react-native";
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
  const [itemToDelete, setItemToDelete] = useState<Item | null>();
  let newArrItems: Item[] = [];

  useEffect(() => {
    loadItems();
  }, []);

  useEffect(() => {
    setPreview(selectedItem?.image || "");
  }, [selectedItem]);

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
      await api.post("/items", {
        name: addItem,
        image: preview ? preview : imagemDefault,
        quantity: 0,
      });

      setOpenModal(false);
      setAddItem("");
      setPreview("");
      loadItems();
    }
  }

  async function cleanList() {
    listaItens.map(async (item) => {
      await api.delete(`items/${item.id}`);
    });
    setListaItens([]);
    setItemToDelete(null);
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

  function ModalCreate() {
    return (
      <Dialog open={openModal}>
        <Dialog.Portal>
          <Dialog.Overlay
            onPress={() => {
              setOpenModal(false);
              setPreview("");
            }}
            key={0}
          />
          <Dialog.Content key={1}>
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
                  autoFocus
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
          <Dialog.Overlay onPress={() => setOpenModalItem(false)} key={0} />
          <Dialog.Content key={1}>
            <Dialog.Description />
            {selectedItem && (
              <YStack alignItems="center" space="$2">
                <Text
                  fontWeight="bold"
                  marginBottom="$3"
                  alignContent="center"
                  fontSize={"$8"}
                >
                  {selectedItem.name}
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
                  {selectedItem.quantity}
                </Text>
                <CustomButton
                  width={"100%"}
                  icon={Minus}
                  tipo="normal"
                  onPress={subtraiItem}
                />
              </YStack>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>
    );
  }

  function ModalAlert() {
    const texto = itemToDelete
      ? `Apagar item: ${itemToDelete.name}`
      : "Apagar lista?";

    return (
      <AlertDialog open={openModalAlert}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay
            onPress={() => {
              setOpenModalAlert(false);
              setItemToDelete(null);
            }}
            key={0}
          />
          <AlertDialog.Content key={1}>
            <YStack alignItems="center" space="$2">
              <Text
                fontWeight="bold"
                marginBottom="$3"
                alignContent="center"
                fontSize={"$8"}
              >
                {texto}
              </Text>
              {itemToDelete ? (
                <CustomButton
                  marginTop={"$2"}
                  width={"100%"}
                  tipo="delete"
                  icon={Trash}
                  onPress={() => {
                    deleteItem();
                    setOpenModalAlert(false);
                  }}
                >
                  Sim
                </CustomButton>
              ) : (
                <CustomButton
                  marginTop={"$2"}
                  width={"100%"}
                  tipo="delete"
                  icon={Trash}
                  onPress={() => {
                    cleanList(), setOpenModalAlert(false);
                  }}
                >
                  Sim
                </CustomButton>
              )}
            </YStack>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog>
    );
  }

  async function deleteItem() {
    if (itemToDelete) await api.delete(`items/${itemToDelete.id}`);
    loadItems();
    setItemToDelete(null);
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
            <ModalCreate />
            <ModalAlert />
          </XStack>
          <ScrollView>
            {listaItens &&
              listaItens.map((item: Item, index: number) => (
                <YStack
                  key={index}
                  p="$4"
                  marginBottom="$2"
                  backgroundColor="$gray3"
                  borderRadius="$4"
                >
                  <TouchableOpacity
                    onLongPress={() => {
                      setItemToDelete(item);
                      setOpenModalAlert(true);
                    }}
                    onPress={() => {
                      setSelectedItem(item);
                      setOpenModalItem(true);
                    }}
                  >
                    <ModalItem />
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
                  </TouchableOpacity>
                </YStack>
              ))}
          </ScrollView>
        </YStack>
      </Theme>
    </TamaguiProvider>
  );
}
