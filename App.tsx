import { Image as ImageIcon, Minus, Plus, Trash } from "@tamagui/lucide-icons";
import { useFonts } from "expo-font";
import * as ImagePicker from "expo-image-picker";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import {
  Animated,
  ScrollView,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";
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
import { SwipeListView } from "react-native-swipe-list-view";
import { space } from "@tamagui/theme-base";

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
    return (
      <AlertDialog open={openModalAlert}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay
            onPress={() => setOpenModalAlert(false)}
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
                Apagar lista?
              </Text>
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
            </YStack>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog>
    );
  }

  // const swipeStyles = StyleSheet.create({
  //   container: {
  //     backgroundColor: "#f4f4f4",
  //     flex: 1,
  //   },
  //   backTextWhite: {
  //     color: "#FFF",
  //   },
  //   rowFront: {
  //     backgroundColor: "#FFF",
  //     borderRadius: 5,
  //     height: 60,
  //     margin: 5,
  //     marginBottom: 15,
  //     shadowColor: "#999",
  //     shadowOffset: { width: 0, height: 1 },
  //     shadowOpacity: 0.8,
  //     shadowRadius: 2,
  //     elevation: 5,
  //   },
  //   rowFrontVisible: {
  //     backgroundColor: "#FFF",
  //     borderRadius: 5,
  //     height: 60,
  //     padding: 10,
  //     marginBottom: 15,
  //   },
  //   rowBack: {
  //     alignItems: "center",
  //     backgroundColor: "#DDD",
  //     flex: 1,
  //     flexDirection: "row",
  //     justifyContent: "space-between",
  //     paddingLeft: 15,
  //     margin: 5,
  //     marginBottom: 15,
  //     borderRadius: 5,
  //   },
  //   backRightBtn: {
  //     alignItems: "flex-end",
  //     bottom: 0,
  //     justifyContent: "center",
  //     position: "absolute",
  //     top: 0,
  //     width: 75,
  //     paddingRight: 17,
  //   },
  //   backRightBtnLeft: {
  //     backgroundColor: "#1f65ff",
  //     right: 75,
  //   },
  //   backRightBtnRight: {
  //     backgroundColor: "red",
  //     right: 0,
  //     borderTopRightRadius: 5,
  //     borderBottomRightRadius: 5,
  //   },
  //   trash: {
  //     height: 25,
  //     width: 25,
  //     marginRight: 7,
  //   },
  //   title: {
  //     fontSize: 14,
  //     fontWeight: "bold",
  //     marginBottom: 5,
  //     color: "#666",
  //   },
  //   details: {
  //     fontSize: 12,
  //     color: "#999",
  //   },
  // });

  // const closeRow = (rowMap: any, rowKey: any) => {
  //   if (rowMap[rowKey]) {
  //     rowMap[rowKey].closeRow();
  //   }
  // };

  // const deleteRow = (rowMap: any, rowKey: any) => {
  //   console.log("rowKey:", rowKey);
  //   closeRow(rowMap, rowKey);
  //   const newData = [...listaItens];
  //   const prevIndex = listaItens.findIndex((item) => item.id === rowKey);
  //   newData.splice(prevIndex, 1);
  //   setListaItens(newData);
  // };

  // const onRowDidOpen = (rowKey: any) => {
  //   console.log("This row opened", rowKey);
  // };

  // const onRightActionStatusChange = (rowKey: any) => {
  //   console.log("onRightActionStatusChange", rowKey);
  // };

  // const onRightAction = (rowKey: any) => {
  //   console.log("onRightAction", rowKey);
  // };

  // const VisibleItem = (props: any) => {
  //   const { data, rowHeightAnimatedValue, removeRow, rightActionState } = props;

  //   if (rightActionState) {
  //     Animated.timing(rowHeightAnimatedValue, {
  //       toValue: 0,
  //       duration: 200,
  //       useNativeDriver: false,
  //     }).start(() => {
  //       removeRow();
  //     });
  //   }

  //   return (
  //     <Animated.View
  //       style={[swipeStyles.rowFront, { height: rowHeightAnimatedValue }]}
  //     >
  //       <TouchableHighlight
  //         style={swipeStyles.rowFrontVisible}
  //         onPress={() => console.log("Element touched")}
  //         underlayColor={"$gray3"}
  //       >
  //         <View>
  //           <Text style={swipeStyles.title} numberOfLines={1}>
  //             {data.item.title}
  //           </Text>
  //           <Text style={swipeStyles.details} numberOfLines={1}>
  //             {data.item.details}
  //           </Text>
  //         </View>
  //       </TouchableHighlight>
  //     </Animated.View>
  //   );
  // };

  // const renderItem = (data: any, rowMap: any) => {
  //   const rowHeightAnimatedValue = new Animated.Value(60);

  //   return (
  //     <VisibleItem
  //       data={data}
  //       style={{ backgroundColor: "blue" }}
  //       rowHeightAnimatedValue={rowHeightAnimatedValue}
  //       removeRow={() => deleteRow(rowMap, data.item.key)}
  //     />
  //   );
  // };

  // const HiddenItemWithActions = (props: any) => {
  //   const {
  //     swipeAnimatedValue,
  //     leftActionActivated,
  //     rightActionActivated,
  //     rowActionAnimatedValue,
  //     rowHeightAnimatedValue,
  //     onClose,
  //     onDelete,
  //   } = props;

  //   if (rightActionActivated) {
  //     Animated.spring(rowActionAnimatedValue, {
  //       toValue: 500,
  //       useNativeDriver: false,
  //     }).start();
  //   } else {
  //     Animated.spring(rowActionAnimatedValue, {
  //       toValue: 75,
  //       useNativeDriver: false,
  //     }).start();
  //   }

  //   return (
  //     <Animated.View
  //       style={[swipeStyles.rowBack, { height: rowHeightAnimatedValue }]}
  //     >
  //       {!leftActionActivated && (
  //         <Animated.View
  //           style={[
  //             swipeStyles.backRightBtn,
  //             swipeStyles.backRightBtnRight,
  //             {
  //               flex: 1,
  //               width: rowActionAnimatedValue,
  //               backgroundColor: "green",
  //             },
  //           ]}
  //         >
  //           <TouchableOpacity
  //             style={[swipeStyles.backRightBtn, swipeStyles.backRightBtnRight]}
  //             onPress={onDelete}
  //           >
  //             <Animated.View
  //               style={[
  //                 swipeStyles.trash,
  //                 {
  //                   transform: [
  //                     {
  //                       scale: swipeAnimatedValue.interpolate({
  //                         inputRange: [-90, -45],
  //                         outputRange: [1, 0],
  //                         extrapolate: "clamp",
  //                       }),
  //                     },
  //                   ],
  //                 },
  //               ]}
  //             >
  //               <Trash />
  //             </Animated.View>
  //           </TouchableOpacity>
  //         </Animated.View>
  //       )}
  //     </Animated.View>
  //   );
  // };

  // const renderHiddenItem = (data: any, rowMap: any) => {
  //   const rowActionAnimatedValue = new Animated.Value(75);
  //   const rowHeightAnimatedValue = new Animated.Value(60);

  //   return (
  //     <HiddenItemWithActions
  //       data={data}
  //       rowMap={rowMap}
  //       rowActionAnimatedValue={rowActionAnimatedValue}
  //       rowHeightAnimatedValue={rowHeightAnimatedValue}
  //       onClose={() => closeRow(rowMap, data.item.key)}
  //       onDelete={() => deleteRow(rowMap, data.item.key)}
  //     />
  //   );
  // };

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
          {/* <SwipeListView
            data={listaItens}
            renderItem={renderItem}
            renderHiddenItem={renderHiddenItem}
            rightOpenValue={-70}
            disableRightSwipe
            onRowDidOpen={onRowDidOpen}
            rightActivationValue={-100}
            rightActionValue={-750}
            onRightAction={onRightAction}
            onRightActionStatusChange={onRightActionStatusChange}
          /> */}
          {/* <ScrollView>
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
                </YStack>
              ))}
          </ScrollView> */}
        </YStack>
      </Theme>
    </TamaguiProvider>
  );
}
