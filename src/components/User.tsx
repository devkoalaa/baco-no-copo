import { useEffect, useState } from "react";
import { Avatar, H4, Text, XStack, YStack } from "tamagui";

import * as SecureStore from "expo-secure-store";

export function User() {
  const [nomeUser, setNomeUser] = useState("Koala");
  const [imagem, setImagem] = useState("https://github.com/devkoalaa.png");

  useEffect(() => {
    SecureStore.getItemAsync("BacoNoCopo.usuario").then((response) => {
      const resultado = response;
      resultado && setNomeUser(JSON.parse(resultado));
    });
  }, []);

  useEffect(() => {
    if (nomeUser == "Afrontoso") {
      setImagem("https://github.com/afrontoso.png");
      SecureStore.setItemAsync("BacoNoCopo.usuario", nomeUser);
      SecureStore.setItemAsync(
        "BacoNoCopo.idUser",
        "301e637b-2d8b-436c-9798-6db0920a8009"
      );
    } else {
      setImagem("https://github.com/devkoalaa.png");
      SecureStore.setItemAsync("BacoNoCopo.usuario", nomeUser);
      SecureStore.setItemAsync(
        "BacoNoCopo.idUser",
        "7743c8dd-bb47-4707-81a4-34b8e42bd367"
      );
    }
  }, [nomeUser]);

  return (
    <XStack
      space={"$2.5"}
      onPress={() => setNomeUser(nomeUser == "Koala" ? "Afrontoso" : "Koala")}
    >
      <Avatar size={"$5"} circular>
        <Avatar.Image src={imagem} />
        <Avatar.Fallback backgroundColor="$gray5" />
      </Avatar>
      <YStack>
        <Text color="$gray10">Olá,</Text>
        <H4 fontWeight={"bold"} mt="$-2">
          {nomeUser}
        </H4>
      </YStack>
    </XStack>
  );
}
