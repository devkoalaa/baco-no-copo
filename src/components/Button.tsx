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
      modal: {
        bg: "$green10",
      },
      outline: {
        borderWidth: "$1",
        borderColor: "rgba(0, 0, 0, 0)",
      },
    },
  } as const,

  defaultVariants: {
    tipo: "normal",
  },
});
