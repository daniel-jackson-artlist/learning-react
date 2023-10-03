import { Card } from "@mui/material";
import styled from "styled-components";

export const Image = styled.img`
  --squircle-smooth: 2;
  --squircle-radius: 32px;
  -webkit-mask-image: paint(squircle);
  width: 200px;
  height: 200px;
  object-fit: cover;
`;

export function Children(props) {
  return (
    <>
      <Card
        sx={{
          backgroundColor: "green",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 4,
          "--squircle-smooth": "2",
          "--squircle-radius": "16px",
          WebkitMaskImage: "paint(squircle)",
        }}
      >
        Hello World
      </Card>
      <Card
        sx={{
          backgroundColor: "red",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 4,
          "--squircle-smooth": "2",
          "--squircle-radius": "16px",
          WebkitMaskImage: "paint(squircle)",
        }}
      >
        <Image src="cat.png" />
      </Card>
    </>
  );
}
