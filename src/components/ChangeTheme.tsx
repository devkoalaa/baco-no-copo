import { Switch, SwitchProps, SwitchThumb, XStack } from "tamagui";
import { Sun, Moon } from "@tamagui/lucide-icons";

export function ChangeTheme({ ...rest }: SwitchProps) {
  return (
    <XStack space="$2" ai="center">
      <Sun size="$2" />
      <Switch bg="$gray6" {...rest}>
        <SwitchThumb animation="bouncy" />
      </Switch>
      <Moon size="$2" />
    </XStack>
  );
}
