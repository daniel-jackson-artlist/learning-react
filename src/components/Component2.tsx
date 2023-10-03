import styled from "styled-components";

export const Image = styled.img`
  --squircle-smooth: 2;
  --squircle-radius: 16px;
  -webkit-mask-image: paint(squircle);
  width: 100px;
  height: 100px;
  object-fit: cover;
`;

export const Component2 = () => {
  return (
    <div style={{ display: "grid", gap: 16, gridTemplateColumns: "1fr 1fr" }}>
      <Image src="cat.png" />
      <Image src="cat.png" />
      <Image src="cat.png" />
      <Image src="cat.png" />
    </div>
  );
};
