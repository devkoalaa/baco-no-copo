import React, { useState } from "react";
import { Dialog, YStack, XStack, Input, Text, Image } from "tamagui";
import { Button as CustomButton } from "../Button";
import { Image as ImageIcon, Plus } from "@tamagui/lucide-icons";

export default function ModalCreate({
  //   openModalProp,
  previewProp,
  addItemProp,
}: {
  //   openModalProp: boolean;
  previewProp: string;
  addItemProp: string;
}) {
  //   const [openModal, setOpenModal] = useState(openModalProp);
  const [preview, setPreview] = useState(previewProp);
  const [addItem, setAddItem] = useState(addItemProp);

  const openImagePicker = () => {
    console.log();
  };

  const submitItem = () => {
    console.log();
  };

  return (
    <Dialog.Portal>
      <Dialog.Overlay
        onPress={() => {
          // setOpenModal(false);
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
  );
}
