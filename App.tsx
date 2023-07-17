import { useFonts } from "expo-font";
import { Input, TamaguiProvider, Theme, XStack, YStack, Text } from "tamagui";
import { ChangeTheme } from "./src/components/ChangeTheme";
import { User } from "./src/components/User";
import config from "./tamagui.config";
import React, { useState } from "react";
import { Button } from "./src/components/Button";

export default function App() {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [loaded] = useFonts({
    Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
    InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
  });

  const [itemValue, setItemValue] = useState("");
  const [listaItens, setListaItens] = useState<string[]>([]);

  if (!loaded) {
    return null;
  }

  function submit() {
    console.log("item:", itemValue);

    setListaItens((e) => [...e, itemValue]);
    console.log("lista:", listaItens);

    console.log("Entrou no submit()");
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
              value={itemValue}
              onChangeText={setItemValue}
              placeholder="Adicionar item..."
              focusStyle={{ bw: 2, boc: "$blue10" }}
            />
            <Button tipo="normal" onPress={submit} />
          </XStack>
          {listaItens.map((item, index) => (
            <Text key={index} m="$1" backgroundColor='$gray10' borderRadius='$2'>
              {item}
            </Text>
          ))}
        </YStack>
      </Theme>
    </TamaguiProvider>
  );
}
