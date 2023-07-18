import { Button as TButton, styled } from "tamagui";
import { Circle } from "@tamagui/lucide-icons";

export const Button = styled(TButton, {
  w: "$5",
  h: "$5",
  icon: Circle,

  variants: {
    tipo: {
      normal: {
        bg: "$blue10",
      },
      delete: {
        bg: "$red10",
      },
      outline: {
        borderWidth: "$1",
        borderColor: "$blue10",
      },
    },
  } as const,

  defaultVariants: {
    tipo: "normal",
  },
});
