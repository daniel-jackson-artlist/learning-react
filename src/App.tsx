import { useContext, useEffect, useRef, useState, createContext } from "react";
import { StraightConnector } from "./icons/StraightConnector";
import "./App.css";
import { CurveInConnector } from "./icons/CurveInConnector";
import { CurveOutConnector } from "./icons/CurveOutConnector";
import styled from "styled-components";
import Prism from "prismjs";
import "prismjs/components/prism-jsx.min.js";
import {
  ArrowBack,
  ArrowForward,
  ArrowRight,
  CalendarMonth,
  CheckOutlined,
  Help,
  Input,
  Lightbulb,
  Memory,
  QuestionMarkRounded,
  Terminal,
  Widgets,
} from "@mui/icons-material";
import ReactLogo from "./assets/react.svg";
import { State } from "./components/State";
import { CodeLinesContext, SpotlightContext } from "./main";
import { Props } from "./components/Props";
import { Component } from "./components/Component";
import { Graph } from "./components/Graph";
import { AnimatePresence, motion } from "framer-motion";
import Tooltip from "@mui/material/Tooltip";
import { Children } from "./components/Children";
import { Component2 } from "./components/Component2";

const Dot = styled.div`
  width: 14px;
  height: 14px;
  margin: 9px;
  border-radius: 50%;
  background-color: ${(props) => (props.isActive ? "white" : "rgb(63,63,63)")};
  transition: ${(props) =>
    props.isActive ? "background-color 0.2s ease-out" : "none"};
  transition-delay: ${(props) => (props.isActive ? "0.4s" : "0s")};
`;

const GREEN = "rgb(25,240,25)";

const Check = () => (
  <div
    style={{
      width: 32,
      height: 32,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: GREEN,
    }}
  >
    <CheckOutlined />
  </div>
);

const Circle = ({
  status = "idle",
}: {
  status?: "idle" | "active" | "checked";
}) => {
  return (
    <AnimatePresence>
      {status === "checked" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Check key="check" />
        </motion.div>
      )}
      {(status === "active" || status === "idle") && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Dot isActive={status === "active"} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const StraightConnectionRoot = ({ isActive = false, isChecked = false }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
    }}
  >
    <StraightConnector isActive={isActive} />
    <Circle status={isChecked ? "checked" : isActive ? "active" : "idle"} />
  </div>
);

const StraightConnectionNested = ({ isActive = false, isChecked = false }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-end",
    }}
  >
    <StraightConnector isActive={isActive} />
    <Circle status={isChecked ? "checked" : isActive ? "active" : "idle"} />
  </div>
);

const CurveInConnection = ({ isActive = false, isChecked = false }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
    }}
  >
    <div
      style={{ display: "flex", flexDirection: "row", alignItems: "flex-end" }}
    >
      <CurveInConnector isActive={isActive} />
      <Circle status={isChecked ? "checked" : isActive ? "active" : "idle"} />
    </div>
  </div>
);

const CurveOutConnection = ({ isActive = false, isChecked = false }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
    }}
  >
    <CurveOutConnector isActive={isActive} />
    <Circle status={isChecked ? "checked" : isActive ? "active" : "idle"} />
  </div>
);

const CODE_PADDING_X = 32;
const CODE_PADDING_Y = 16;
const CODE_LINE_HEIGHT = 32;

const CodeContainer = styled.pre`
  --squircle-smooth: 2;
  --squircle-radius: 32px;
  -webkit-mask-image: paint(squircle);
  background: rgb(50, 50, 50);
  margin: 0;
  flex: 1;
  padding: ${CODE_PADDING_Y}px ${CODE_PADDING_X}px;
  line-height: ${CODE_LINE_HEIGHT}px;
  font-size: 20px;
  & .token.function-variable {
    font-weight: 600;
  }
  & .token.attr-name {
    font-weight: 500;
  }
  & .token.tag {
    font-weight: 600;
  }
  & .token.attr-value {
    font-weight: 400;
    font-style: italic;
  }
`;

const StyledContentContainer = styled(motion.div)`
  --squircle-smooth: 2;
  --squircle-radius: 64px;
  -webkit-mask-image: paint(squircle);
  background: linear-gradient(
    to bottom,
    rgb(25, 25, 25, 0.33),
    rgba(25, 25, 25, 0.66)
  );
  backdrop-filter: blur(64px);
  width: 100%;
  padding: 56px 64px;
  margin-right: 48px;
  margin-top: 48px;
  margin-bottom: 48px;
  line-height: 2;
  font-size: 22px;
  & .token.function-variable {
    font-weight: 600;
  }
  & .token.attr-name {
    font-weight: 500;
  }
  & .token.tag {
    font-weight: 600;
  }
  & .token.attr-value {
    font-weight: 400;
    font-style: italic;
  }
  display: flex;
  flex-direction: column;
`;

const ContentContainer = ({ children }) => {
  return (
    <StyledContentContainer
      initial={{ opacity: 0, y: 10 }}
      style={{
        willChange: "transform",
      }}
      animate={{
        opacity: 1,
        y: 0,
        transition: {
          y: { type: "tween", duration: 0.15, ease: "circOut" },
          opacity: {
            duration: 0.15,
            type: "tween",
            ease: "linear",
          },
        },
      }}
      exit={{
        opacity: 0,
        y: -10,
        transition: {
          y: {
            type: "tween",
            duration: 0.15,
            ease: "circIn",
          },
          opacity: {
            duration: 0.15,
            type: "tween",
            ease: "linear",
          },
        },
      }}
    >
      {children}
    </StyledContentContainer>
  );
};

const CodeSnippet = ({ src, language = "jsx" }) => {
  const [text, setText] = useState("");

  const { lineStart, lineEnd } = useContext(CodeLinesContext);

  const ref = useRef(null);

  const { x, y, width, height, setIsVisible } = useContext(SpotlightContext);

  useEffect(() => {
    if (lineEnd === null || lineStart === null) {
      setIsVisible(false);
      return;
    }
    setIsVisible(true);
    const rect = ref.current?.getBoundingClientRect();
    const spotlightPadding = 2;
    const topOffset = lineStart * CODE_LINE_HEIGHT;
    const segmentHeight = (lineEnd - lineStart + 1) * CODE_LINE_HEIGHT;
    height.set(segmentHeight + spotlightPadding * 2);
    width.set(rect.width - CODE_PADDING_X * 2);
    x.set(rect.x + CODE_PADDING_X);
    y.set(rect.y + CODE_PADDING_Y + topOffset - spotlightPadding);
  }, [lineStart, lineEnd]);

  const getData = async () => {
    const data = await fetch(src);
    const text = await data.text();
    const highlighted = Prism.highlight(
      text,
      Prism.languages[language],
      language,
      {
        indent: 2,
        lineNumbers: true,
      },
    );
    setText(highlighted);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <CodeContainer
      ref={ref}
      dangerouslySetInnerHTML={{ __html: text }}
    ></CodeContainer>
  );
};

const SidebarHeading = ({
  isIndented = false,
  title = "Lorem Ipsum",
  isActive = false,
}) => (
  <p
    style={{
      height: 32,
      marginLeft: isIndented ? 0 : -32,
      paddingLeft: 8,
      lineHeight: "32px",
      fontSize: 22,
      fontWeight: 600,
      opacity: isActive ? 1 : 0.25,
    }}
  >
    {title}
  </p>
);

const sidebarItems = [
  { title: "Intro", isIndented: false },
  { title: "Traditional Website", isIndented: true },
  { title: "Single Page App", isIndented: true },
  { title: "Other Libraries", isIndented: true },
  { title: "What is React?", isIndented: false },
  { title: "Key Concepts", isIndented: false },
  { title: "Components", isIndented: true },
  { title: "Props", isIndented: true },
  { title: "Nesting", isIndented: true },
  { title: "State", isIndented: true },
  { title: "Artlist Example", isIndented: false },
  { title: "Fin", isIndented: false },
];

const Sidebar = ({ index = 0 }) => (
  <div
    style={{
      padding: 48,
      paddingLeft: 48,
      paddingRight: 48,
      flexShrink: 0,
      display: "flex",
      flexDirection: "column",
      gap: 32,
    }}
  >
    <h1 style={{ margin: 0, fontSize: 28, display: "flex", gap: 10 }}>
      <img src={ReactLogo} />
      Learning React
    </h1>
    <div style={{ display: "flex" }}>
      <div style={{ width: 64 }}>
        {sidebarItems.map((item, i) => {
          if (i === 0) {
            return (
              <Circle
                key={i}
                status={index > 0 ? "checked" : index > -1 ? "active" : "idle"}
              />
            );
          }
          if (sidebarItems[i - 1].isIndented && !item.isIndented) {
            return (
              <CurveOutConnection
                key={i}
                isActive={index > i - 1}
                isChecked={index > i}
              />
            );
          }
          if (!sidebarItems[i - 1]?.isIndented && item.isIndented) {
            return (
              <CurveInConnection
                key={i}
                isActive={index > i - 1}
                isChecked={index > i}
              />
            );
          }
          if (item.isIndented && sidebarItems[i - 1].isIndented) {
            return (
              <StraightConnectionNested
                key={i}
                isActive={index > i - 1}
                isChecked={index > i}
              />
            );
          }
          return (
            <StraightConnectionRoot
              key={i}
              isActive={index > i - 1}
              isChecked={index > i}
            />
          );
        })}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
        {sidebarItems.map((item, i) => (
          <SidebarHeading
            key={i}
            isActive={index > i - 1}
            isIndented={item.isIndented}
            title={item.title}
          />
        ))}
      </div>
    </div>
  </div>
);

const ComponentExample = styled.div`
  --squircle-smooth: 2;
  --squircle-radius: 32px;
  -webkit-mask-image: paint(squircle);
  background: white;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px;
`;

const TextContent = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 12px;
`;

const CodeContent = styled.div`
  display: flex;
  gap: 32px;
`;

const StateSlide = () => (
  <ContentContainer>
    <TextContent>
      <h1>State</h1>
      <p>
        What if we need to update something from within a component, without
        props?
      </p>
      <p>
        We can define a state value with <code>useState</code>
      </p>
      <p>State allows components to "remember" things</p>
    </TextContent>
    <CodeContent>
      <CodeSnippet src="State.txt" />
      <ComponentExample>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <State />
          <State />
        </div>
      </ComponentExample>
    </CodeContent>
  </ContentContainer>
);

const ArtlistSlide = () => (
  <ContentContainer>
    <TextContent>
      <h1>
        <a target="_blank" href="https://artlist.io">
          Artlist Example
        </a>
      </h1>
    </TextContent>
    <CodeContent>
      <CodeSnippet src="Artlist.txt" />
    </CodeContent>
    <div
      style={{ display: "flex", gap: 32, alignItems: "center", marginTop: 32 }}
    >
      {[0, 1, 2, 3].map((index) => (
        <SquircleCard
          style={{
            width: index === 1 ? 288 : 108,
            height: 192,
            backgroundColor:
              index === 1 ? "rgb(210, 60, 20)" : "rgb(200, 140, 00)",
          }}
        >
          {index}
        </SquircleCard>
      ))}
    </div>
  </ContentContainer>
);

const PropsSlide = () => (
  <ContentContainer>
    <TextContent>
      <h1>Props</h1>
      <p>Pass data to components</p>
      <p>
        When props change, the component <b>reacts</b>
      </p>
    </TextContent>
    <CodeContent>
      <CodeSnippet src="Props.txt" />
      <ComponentExample>
        <Props colour="red" />
        <div style={{ width: 32 }}></div>
        <Props colour="green" />
      </ComponentExample>
    </CodeContent>
  </ContentContainer>
);

const ChildrenSlide = () => (
  <ContentContainer>
    <TextContent>
      <h1>Nesting</h1>
      <p>
        Special prop called <code>children</code>
      </p>
      <p>Lets us nest components</p>
    </TextContent>
    <CodeContent>
      <CodeSnippet src="Children.txt" />
      <ComponentExample>
        <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
          <Children colour="red" />
        </div>
      </ComponentExample>
    </CodeContent>
  </ContentContainer>
);

const ComponentSlide = () => (
  <ContentContainer>
    <TextContent>
      <h1>Components</h1>
      <p>The core "building blocks" of react</p>
      <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
        <SquircleCard style={{ backgroundColor: "rgb(200, 140, 00)" }}>
          <div>⚡️JSX</div>
          <p style={{ marginTop: -16, textAlign: "center", lineHeight: 1.5 }}>
            <code>{`<CuteCat />`}</code>
          </p>
        </SquircleCard>
        <ArrowForward fontSize="large" />
        <SquircleCard style={{ backgroundColor: "rgb(210, 60, 20)" }}>
          <div>🧱HTML</div>
          <p style={{ marginTop: -16 }}>
            <code style={{ fontSize: 16 }}>{`<img src="cat.png" />`}</code>
          </p>
        </SquircleCard>
      </div>
    </TextContent>
    <CodeContent>
      <CodeSnippet src="Component.txt" />
      <ComponentExample>
        <Component />
      </ComponentExample>
    </CodeContent>
  </ContentContainer>
);

const ComponentSlide2 = () => (
  <ContentContainer>
    <TextContent>
      <h1>Components</h1>
      <p>The power of component comes in grouping things together</p>
      <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
        <SquircleCard style={{ backgroundColor: "rgb(200, 140, 00)" }}>
          <div>⚡️JSX</div>
          <p style={{ marginTop: -16, textAlign: "center", lineHeight: 1.5 }}>
            <code>{`<CuteCat />`}</code>
          </p>
        </SquircleCard>
        <ArrowForward fontSize="large" />
        <div
          style={{ display: "grid", gap: 16, gridTemplateColumns: "1fr 1fr" }}
        >
          {[0, 1, 2, 3].map((index) => (
            <SquircleCard
              key={index}
              style={{
                backgroundColor: "rgb(210, 60, 20)",
                width: 128,
                height: 128,
                fontSize: 32,
              }}
            >
              <div>🧱HTML</div>
            </SquircleCard>
          ))}
        </div>
      </div>
    </TextContent>
    <CodeContent>
      <CodeSnippet src="Component2.txt" />
      <ComponentExample>
        <Component2 />
      </ComponentExample>
    </CodeContent>
  </ContentContainer>
);

const IntroSlide = () => (
  <ContentContainer>
    <TextContent>
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <h1
          style={{
            display: "flex",
            gap: 16,
            alignItems: "center",
            fontSize: 64,
          }}
        >
          <motion.img
            animate={{ rotate: [0, 360] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 6 }}
            style={{ width: 72 }}
            src={ReactLogo}
          />
          Learning React
        </h1>
      </div>
    </TextContent>
  </ContentContainer>
);

const IntroSlide2 = () => (
  <ContentContainer>
    <TextContent>
      <h1>Intro</h1>
      {/*<p>React is a Javascript library</p>*/}
      {/*<p>*/}
      {/*  Used to build complex <b>reactive</b> website (and apps!)*/}
      {/*</p>*/}
      {/*<br />*/}
      <ConceptTitle>Why use it?</ConceptTitle>
      <ConceptTitle>Some examples</ConceptTitle>
      <ConceptTitle>Gain an understanding of what React can do</ConceptTitle>
      <ConceptTitle>
        Questions (at any time)
        {/*<i>(it's difficult to fill 30 mins!)</i>*/}
      </ConceptTitle>
    </TextContent>
  </ContentContainer>
);

const SquircleCard = styled.div`
  --squircle-smooth: 2;
  --squircle-radius: 16px;
  -webkit-mask-image: paint(squircle);
  width: 256px;
  height: 256px;
  font-size: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const SquircleImage = styled.img`
  --squircle-smooth: 2;
  --squircle-radius: 16px;
  -webkit-mask-image: paint(squircle);
  width: 640px;
`;

const HistorySlide = () => (
  <ContentContainer>
    <TextContent>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          fontSize: 128,
          gap: 64,
          flex: 1,
          width: "100%",
          justifyContent: "center",
        }}
      >
        <SquircleCard style={{ backgroundColor: "rgb(210, 60, 20)" }}>
          <div>🧱HTML</div>
          <p style={{ marginTop: -16 }}>Structure</p>
        </SquircleCard>
        <SquircleCard style={{ backgroundColor: "rgb(210, 20, 180)" }}>
          <div>🎨CSS</div>
          <p style={{ marginTop: -16 }}>Make it shiny</p>
        </SquircleCard>
        <SquircleCard style={{ backgroundColor: "rgb(200, 140, 00)" }}>
          <div>⚡️JS</div>
          <p style={{ marginTop: -16, textAlign: "center", lineHeight: 1.5 }}>
            Interactivity <br />
            (to a point)
          </p>
        </SquircleCard>
      </div>
    </TextContent>
  </ContentContainer>
);

const SPASlide = () => (
  <ContentContainer>
    <TextContent>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          fontSize: 128,
          gap: 64,
          flex: 1,
          width: "100%",
          justifyContent: "center",
        }}
      >
        <Tooltip arrow open title={<p>Can I have the home page?</p>}>
          👨‍💻
        </Tooltip>
        <motion.div
          animate={{
            x: [-100, -50, 0, 50, 100],
            opacity: [0, 1, 1, 1, 0],
            scale: [0.5, 1, 1, 1, 0.5],
          }}
          transition={{ duration: 2, ease: "linear" }}
        >
          👾
        </motion.div>
        🤖
      </div>
    </TextContent>
  </ContentContainer>
);

const SPASlide2 = () => (
  <ContentContainer>
    <TextContent>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          fontSize: 128,
          gap: 256,
          flex: 1,
          width: "100%",
          justifyContent: "center",
        }}
      >
        💁
        <Tooltip arrow open title={<p>I'm thinking..</p>}>
          <motion.div
            animate={{ scale: [0.9, 1.2, 0.9] }}
            transition={{ repeat: Infinity }}
          >
            🤖
          </motion.div>
        </Tooltip>
      </div>
    </TextContent>
  </ContentContainer>
);

const SPASlide3 = () => (
  <ContentContainer>
    <TextContent>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          fontSize: 128,
          gap: 64,
          flex: 1,
          width: "100%",
          justifyContent: "center",
        }}
      >
        🙎️
        <motion.div
          animate={{
            x: [100, 50, 0, -50, -100],
            opacity: [0, 1, 1, 1, 0],
            scale: [0.5, 1, 1, 1, 0.5],
          }}
          transition={{ duration: 2, ease: "linear" }}
        >
          📄
        </motion.div>
        <Tooltip arrow open title={<p>Here is the page</p>}>
          🤖
        </Tooltip>
      </div>
    </TextContent>
  </ContentContainer>
);

const SPASlide4 = () => (
  <ContentContainer>
    <TextContent>
      <h1>Multi-Page App</h1>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          fontSize: 128,
          gap: 64,
          flex: 1,
          width: "100%",
          justifyContent: "center",
        }}
      >
        <div>
          <div>🤦‍</div>
          <div>🤦‍</div>
          <div>🤦‍</div>
        </div>
        <div>
          <motion.div
            animate={{
              y: [200, 150, 100, 50, 0],
              x: [100, 50, 0, -50, -100],
              opacity: [0, 1, 1, 1, 0],
              scale: [0.5, 1, 1, 1, 0.5],
            }}
            transition={{ duration: 1.5, ease: "linear", repeat: Infinity }}
          >
            📄
          </motion.div>
          <motion.div
            animate={{
              y: [0, 0, 0, 0, 0, 0],
              x: [100, 50, 0, -50, -100],
              opacity: [0, 1, 1, 1, 0],
              scale: [0.5, 1, 1, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              ease: "linear",
              repeat: Infinity,
              delay: 0.5,
            }}
          >
            📄
          </motion.div>
          <motion.div
            animate={{
              y: [-200, -150, -100, -50, 0],
              x: [100, 50, 0, -50, -100],
              opacity: [0, 1, 1, 1, 0],
              scale: [0.5, 1, 1, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              ease: "linear",
              repeat: Infinity,
              delay: 1,
            }}
          >
            📄
          </motion.div>
        </div>
        <motion.div
          animate={{
            x: [-10, 10, -10],
          }}
          transition={{
            duration: 0.1,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          🤖
        </motion.div>
      </div>
    </TextContent>
  </ContentContainer>
);

const SPASlide5 = () => (
  <ContentContainer>
    <TextContent>
      <h1>Single-Page App</h1>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          fontSize: 128,
          gap: 128,
          flex: 1,
          width: "100%",
          justifyContent: "center",
        }}
      >
        👨‍💻
        <motion.div
          animate={{
            x: [200, 100, 0, -100, -200],
            opacity: [0, 1, 1, 1, 0],
            scale: [0.5, 1, 1, 1, 0.5],
          }}
          transition={{ duration: 2, ease: "linear" }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              fontSize: 48,
              gap: 32,
              lineHeight: 1.25,
            }}
          >
            <div>📄</div>
            <div>📄</div>
            <div>📄</div>
            <div>📄</div>
            <div>📄</div>
            <div>📄</div>
            <div>📄</div>
            <div>📄</div>
            <div>📄</div>
          </div>
        </motion.div>
        <Tooltip arrow open title={<p>Have the whole app!</p>}>
          🤖
        </Tooltip>
      </div>
    </TextContent>
  </ContentContainer>
);

const SPASlide6 = () => (
  <ContentContainer>
    <TextContent>
      <h1>Single-Page App</h1>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          fontSize: 128,
          gap: 128,
          flex: 1,
          width: "100%",
          justifyContent: "center",
        }}
      >
        👨‍💻
        <motion.div
          animate={{
            x: [150, 0, -150, -150, -150, -150],
            opacity: [0, 1, 0, 0, 0],
            scale: [0.25, 0.5, 0.25, 0.25, 0.25],
          }}
          transition={{ duration: 1.5, ease: "linear", repeat: Infinity }}
        >
          👾
        </motion.div>
        🤖
      </div>
    </TextContent>
  </ContentContainer>
);

const GraphSlide = () => (
  <ContentContainer>
    <TextContent>
      <h1>Rise of the SPA libraries</h1>
    </TextContent>
    <Graph />
    <p style={{ textAlign: "center" }}>
      Percentage of JavaScript developers who have used React
    </p>
    <p style={{ textAlign: "center" }}>(https://2022.stateofjs.com/)</p>
  </ContentContainer>
);

const QuestionsSlide = () => (
  <ContentContainer>
    <TextContent>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
        }}
      >
        <h1>Thank You</h1>
        <p>
          More info can be found at <code>react.dev</code>
        </p>
      </div>
    </TextContent>
  </ContentContainer>
);

const ConceptTitle = styled.h2`
  display: flex;
  align-items: center;
  margin-bottom: -16px;
  margin-top: 32px;
  font-weight: 600;
`;

const WhatIsReactSlide = () => (
  <ContentContainer>
    <TextContent>
      <h1>What is React?</h1>
      <p>Javascript library to build UIs based on Components </p>
      <p>Generate HTML from Javascript</p>
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          gap: 32,
          justifyContent: "center",
        }}
      >
        <SquircleCard style={{ backgroundColor: "rgb(210, 60, 20)" }}>
          <div>🧱HTML</div>
        </SquircleCard>
        <ArrowBack fontSize="large" />
        <SquircleCard style={{ backgroundColor: "rgb(200, 140, 00)" }}>
          <div>⚡️JSX</div>
          <p style={{ marginTop: -16 }}>Now I'm in charge</p>
        </SquircleCard>
        <ArrowForward fontSize="large" />
        <SquircleCard style={{ backgroundColor: "rgb(210, 60, 20)" }}>
          <div>🧱HTML</div>
        </SquircleCard>
      </div>
    </TextContent>
  </ContentContainer>
);

const KeyConceptsSlide = () => (
  <ContentContainer>
    <TextContent>
      <h1>Key Concepts</h1>
      <ConceptTitle>
        <Widgets style={{ width: 32, height: 32, marginRight: 8 }} />
        Components
      </ConceptTitle>
      <p>UI Building blocks</p>
      <ConceptTitle>
        <Input style={{ width: 32, height: 32, marginRight: 8 }} />
        Props
      </ConceptTitle>
      <p>Components accept inputs, called props</p>
      <ConceptTitle>
        <Memory style={{ width: 32, height: 32, marginRight: 8 }} />
        State
      </ConceptTitle>
      <p>Like a components internal memory</p>
    </TextContent>
  </ContentContainer>
);

type SequenceItem = {
  slide: any;
  lineStart: number | null;
  lineEnd: number | null;
  index: number;
};

const sequence: SequenceItem[] = [
  {
    index: 0,
    slide: IntroSlide,
    lineStart: null,
    lineEnd: null,
  },
  {
    index: 0,
    slide: IntroSlide2,
    lineStart: null,
    lineEnd: null,
  },
  {
    index: 1,
    slide: HistorySlide,
    lineStart: null,
    lineEnd: null,
  },
  {
    index: 1,
    slide: SPASlide,
    lineStart: null,
    lineEnd: null,
  },
  {
    index: 1,
    slide: SPASlide2,
    lineStart: null,
    lineEnd: null,
  },
  {
    index: 1,
    slide: SPASlide3,
    lineStart: null,
    lineEnd: null,
  },
  {
    index: 1,
    slide: SPASlide4,
    lineStart: null,
    lineEnd: null,
  },
  {
    index: 2,
    slide: SPASlide5,
    lineStart: null,
    lineEnd: null,
  },
  {
    index: 2,
    slide: SPASlide6,
    lineStart: null,
    lineEnd: null,
  },
  {
    index: 3,
    slide: GraphSlide,
    lineStart: null,
    lineEnd: null,
  },
  {
    index: 4,
    slide: WhatIsReactSlide,
    lineStart: null,
    lineEnd: null,
  },
  {
    index: 5,
    slide: KeyConceptsSlide,
    lineStart: null,
    lineEnd: null,
  },
  {
    index: 6,
    slide: ComponentSlide,
    lineStart: null,
    lineEnd: null,
  },
  {
    index: 6,
    slide: ComponentSlide2,
    lineStart: null,
    lineEnd: null,
  },
  {
    index: 7,
    slide: PropsSlide,
    lineStart: null,
    lineEnd: null,
  },
  {
    index: 7,
    slide: PropsSlide,
    lineStart: 0,
    lineEnd: 0,
  },
  {
    index: 7,
    slide: PropsSlide,
    lineStart: 1,
    lineEnd: 3,
  },
  {
    index: 7,
    slide: PropsSlide,
    lineStart: 6,
    lineEnd: 8,
  },
  {
    index: 7,
    slide: PropsSlide,
    lineStart: null,
    lineEnd: null,
  },
  {
    index: 8,
    slide: ChildrenSlide,
    lineStart: null,
    lineEnd: null,
  },
  {
    index: 8,
    slide: ChildrenSlide,
    lineStart: 2,
    lineEnd: 4,
  },
  {
    index: 8,
    slide: ChildrenSlide,
    lineStart: 9,
    lineEnd: 11,
  },
  {
    index: 8,
    slide: ChildrenSlide,
    lineStart: 13,
    lineEnd: 15,
  },

  {
    index: 8,
    slide: ChildrenSlide,
    lineStart: null,
    lineEnd: null,
  },
  {
    index: 9,
    slide: StateSlide,
    lineStart: null,
    lineEnd: null,
  },
  {
    index: 9,
    slide: StateSlide,
    lineStart: 1,
    lineEnd: 1,
  },
  {
    index: 9,
    slide: StateSlide,
    lineStart: 3,
    lineEnd: 5,
  },
  {
    index: 9,
    slide: StateSlide,
    lineStart: 8,
    lineEnd: 10,
  },
  {
    index: 9,
    slide: StateSlide,
    lineStart: null,
    lineEnd: null,
  },
  {
    index: 10,
    slide: ArtlistSlide,
    lineStart: null,
    lineEnd: null,
  },
  {
    index: 10,
    slide: ArtlistSlide,
    lineStart: 1,
    lineEnd: 1,
  },
  {
    index: 10,
    slide: ArtlistSlide,
    lineStart: 4,
    lineEnd: 7,
  },
  {
    index: 10,
    slide: ArtlistSlide,
    lineStart: null,
    lineEnd: null,
  },
  {
    index: 11,
    slide: QuestionsSlide,
    lineStart: null,
    lineEnd: null,
  },
];

function App() {
  const [sequenceIndex, setSequenceIndex] = useState(0);

  const handleKeyDown = (e) => {
    if (e.key === "ArrowRight" || e.key === " ") {
      setSequenceIndex((prev) => {
        if (prev < sequence.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }
    if (e.key === "ArrowLeft") {
      setSequenceIndex((prev) => {
        if (prev > 0) {
          return prev - 1;
        }
        return prev;
      });
    }
  };

  const handleConnect = () => {
    console.log("connect");
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("connect", handleConnect);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("connect", handleConnect);
    };
  }, []);

  const Slide = sequence[sequenceIndex].slide;
  const lineStart = sequence[sequenceIndex].lineStart;
  const lineEnd = sequence[sequenceIndex].lineEnd;

  return (
    <CodeLinesContext.Provider value={{ lineStart, lineEnd }}>
      <div style={{ display: "flex", height: "100%" }}>
        <Sidebar index={sequence[sequenceIndex].index} />
        <AnimatePresence mode="wait">
          <Slide
            key={`${sequence[sequenceIndex].index}${sequence[sequenceIndex].slide}`}
          />
        </AnimatePresence>
      </div>
    </CodeLinesContext.Provider>
  );
}

export default App;
