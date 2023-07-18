import { Button as TButton, styled } from "tamagui";

export const Button = styled(TButton, {
  w: "$5",
  h: "$5",

  variants: {
    tipo: {
      normal: {
        bg: "$blue10",
      },
      toxic: {
        bg: "$purple10",
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
