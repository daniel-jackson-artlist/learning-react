import React, { PureComponent } from "react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";

const data = [
  {
    name: "React",
    Usage: 81.8,
  },
  {
    name: "Angular",
    Usage: 48.8,
  },
  {
    name: "Vue",
    Usage: 46.2,
  },
  {
    name: "Svelte",
    Usage: 21.2,
  },
  {
    name: "Preact",
    Usage: 12.8,
  },
  {
    name: "Ember",
    Usage: 7.5,
  },
  {
    name: "Solid",
    Usage: 6.3,
  },
];

const colors = [
  "#d88c9a",
  "#f2d0a9",
  "#006d77",
  "#f1e3d3",
  "#99c1b9",
  "#8e7dbe",
];

const getSquirclePath = (x, y, width, height, radii, smooth) => {
  const lineWidthOffset = 0; // Assuming lineWidthOffset is 0 as it's not defined in the given code snippet
  return `
        M${x + radii[0]},${y + lineWidthOffset}
        L${x + width - radii[1]},${y + lineWidthOffset}
        C${x + width - radii[1] / smooth},${y + lineWidthOffset} ${
          x + width - lineWidthOffset
        },${y + radii[1] / smooth} ${x + width - lineWidthOffset},${
          y + radii[1]
        }
        L${x + width - lineWidthOffset},${y + height - radii[2]}
        C${x + width - lineWidthOffset},${y + height - radii[2] / smooth} ${
          x + width - radii[2] / smooth
        },${y + height - lineWidthOffset} ${x + width - radii[2]},${
          y + height - lineWidthOffset
        }
        L${x + radii[3]},${y + height - lineWidthOffset}
        C${x + radii[3] / smooth},${y + height - lineWidthOffset} ${
          x + lineWidthOffset
        },${y + height - radii[3] / smooth} ${x + lineWidthOffset},${
          y + height - radii[3]
        }
        L${x + lineWidthOffset},${y + radii[0]}
        C${x + lineWidthOffset},${y + radii[0] / smooth} ${
          x + radii[0] / smooth
        },${y + lineWidthOffset} ${x + radii[0]},${y + lineWidthOffset}
        Z
    `;
};

const radii = [16, 16, 0, 0];
const smooth = 4;

const SquircleBar = (props) => {
  const { fill, x, y, width, height } = props;

  return (
    <path
      d={getSquirclePath(x, y, width, height, radii, smooth)}
      stroke="none"
      fill={fill}
    />
  );
};

export const Graph = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart width={500} height={300} data={data}>
        <XAxis dataKey="name" />

        <Bar
          shape={<SquircleBar />}
          yAxisId="right"
          dataKey="Usage"
          barSize={75}
        >
          <LabelList
            dataKey="Usage"
            position="top"
            formatter={(tick) => {
              return `${tick}%`;
            }}
          />
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};
