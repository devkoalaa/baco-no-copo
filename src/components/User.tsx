import { useEffect, useState } from "react";
import { Avatar, H4, Text, XStack, YStack } from "tamagui";

import * as SecureStore from "expo-secure-store";

export function User() {
  const [alterUser, setAlterUser] = useState(false);
  const [nome, setNome] = useState("Koala");
  const [imagem, setImagem] = useState("https://github.com/devkoalaa.png");

  useEffect(() => {
    SecureStore.getItemAsync("BacoNoCopo.usuario").then((response) => {
      const resultado = response;
      resultado && setAlterUser(JSON.parse(resultado));
    });
  }, []);

  useEffect(() => {
    if (alterUser) {
      setNome("Afrontoso");
      setImagem("https://github.com/afrontoso.png");
      SecureStore.setItemAsync("BacoNoCopo.usuario", JSON.stringify(alterUser));
    } else {
      setNome("Koala");
      setImagem("https://github.com/devkoalaa.png");
      SecureStore.setItemAsync("BacoNoCopo.usuario", JSON.stringify(alterUser));
    }
  }, [alterUser]);

  return (
    <XStack space={"$2.5"} onPress={() => setAlterUser(!alterUser)}>
      <Avatar size={"$5"} circular>
        <Avatar.Image src={imagem} />
        <Avatar.Fallback backgroundColor="$gray5" />
      </Avatar>
      <YStack>
        <Text color="$gray10">Olá,</Text>
        <H4 fontWeight={"bold"} mt="$-2">
          {nome}
        </H4>
      </YStack>
    </XStack>
  );
}
