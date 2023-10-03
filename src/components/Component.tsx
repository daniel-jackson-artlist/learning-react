import styled from "styled-components";

export const Image = styled.img`
  --squircle-smooth: 2;
  --squircle-radius: 32px;
  -webkit-mask-image: paint(squircle);
  width: 200px;
  height: 200px;
  object-fit: cover;
`;

export const Component = () => {
  return <Image src="cat.png" />;
};
