import { useEffect, useState } from "react";
import { Avatar, H4, Text, XStack, YStack } from "tamagui";

export function User() {
  const [alterUser, setAlterUser] = useState(false);
  const [nome, setNome] = useState("Koala");
  const [imagem, setImagem] = useState("https://github.com/devkoalaa.png");

  useEffect(() => {
    if (alterUser) {
      setNome("Afrontoso");
      setImagem("https://github.com/afrontoso.png");
    } else {
      setNome("Koala");
      setImagem("https://github.com/devkoalaa.png");
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
