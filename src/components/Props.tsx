import { Card } from "@mui/material";

export function Props(props) {
  const style = {
    backgroundColor: props.colour,
  };
  return (
    <Card
      style={{
        ...style,
        width: 128,
        height: 128,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        "--squircle-smooth": "2",
        "--squircle-radius": "16px",
        WebkitMaskImage: "paint(squircle)",
      }}
    ></Card>
  );
}
