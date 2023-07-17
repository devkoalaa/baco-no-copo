import { Button as TButton, styled } from "tamagui";
import { Search } from "@tamagui/lucide-icons";

export const Button = styled(TButton, {
  w: "$5",
  h: "$5",
  icon: Search,  

  variants: {
    tipo: {
      normal: {
        bg: "$blue10",
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
