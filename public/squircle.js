const drawSquircle = (ctx, geom, radii, smooth, lineWidth, color, offset) => {
  const defaultFill = color;
  const lineWidthOffset = lineWidth / 2;
  ctx.translate(offset.x, offset.y);
  ctx.beginPath();
  ctx.lineTo(radii[0], lineWidthOffset);
  ctx.lineTo(geom.width - radii[1], lineWidthOffset);
  ctx.bezierCurveTo(
    geom.width - radii[1] / smooth,
    lineWidthOffset,
    geom.width - lineWidthOffset,
    radii[1] / smooth,
    geom.width - lineWidthOffset,
    radii[1],
  );
  ctx.lineTo(geom.width - lineWidthOffset, geom.height - radii[2]);
  ctx.bezierCurveTo(
    geom.width - lineWidthOffset,
    geom.height - radii[2] / smooth,
    geom.width - radii[2] / smooth,
    geom.height - lineWidthOffset,
    geom.width - radii[2],
    geom.height - lineWidthOffset,
  );
  ctx.lineTo(radii[3], geom.height - lineWidthOffset);
  ctx.bezierCurveTo(
    radii[3] / smooth,
    geom.height - lineWidthOffset,
    lineWidthOffset,
    geom.height - radii[3] / smooth,
    lineWidthOffset,
    geom.height - radii[3],
  );
  ctx.lineTo(lineWidthOffset, radii[0]);
  ctx.bezierCurveTo(
    lineWidthOffset,
    radii[0] / smooth,
    radii[0] / smooth,
    lineWidthOffset,
    radii[0],
    lineWidthOffset,
  );
  ctx.closePath();
  if (lineWidth) {
    ctx.strokeStyle = defaultFill;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  } else {
    ctx.fillStyle = defaultFill;
    ctx.fill();
  }
};

class SquircleClass {
  static get contextOptions() {
    return { alpha: true };
  }
  static get inputProperties() {
    return [
      "--squircle-radius",
      "--squircle-radius-top-left",
      "--squircle-radius-top-right",
      "--squircle-radius-bottom-right",
      "--squircle-radius-bottom-left",
      "--squircle-smooth",
      "--squircle-outline",
      "--squircle-fill",
      "--squircle-width",
      "--squircle-height",
      "--squircle-x",
      "--squircle-y",
    ];
  }
  paint(ctx, geom, properties) {
    const smoothRatio = 10;
    const distanceRatio = 1.8;
    const squircleSmooth = parseFloat(
      properties.get("--squircle-smooth") * smoothRatio,
    );
    const individualRadiiProps = SquircleClass.inputProperties.slice(1, 5);
    let squircleRadii = individualRadiiProps.map((prop) => {
      const value = properties.get(prop);
      return value ? parseInt(value, 10) * distanceRatio : NaN;
    });

    let squircleHeight = geom.height;
    const parsedHeight = parseInt(properties.get("--squircle-height"), 10);
    if (parsedHeight) {
      squircleHeight = parsedHeight;
    }
    let squircleWidth = geom.width;
    const parsedWidth = parseInt(properties.get("--squircle-width"), 10);
    if (parsedWidth) {
      squircleWidth = parsedWidth;
    }
    let squircleX = 0;
    const parsedX = parseInt(properties.get("--squircle-x"), 10);
    if (parsedX) {
      squircleX = parsedX;
    }
    let squircleY = 0;
    const parsedY = parseInt(properties.get("--squircle-y"), 10);
    if (parsedY) {
      squircleY = parsedY;
    }

    let shorthand_R;
    if (squircleRadii.some(isNaN)) {
      const radiusRegex = /([0-9]+[a-z%]*)/g;
      const radius_shorthand = properties.get("--squircle-radius").toString();
      const matches = radius_shorthand.match(radiusRegex);
      if (matches) {
        shorthand_R = matches.map((val) => parseInt(val, 10) * distanceRatio);
        while (shorthand_R.length < 4) {
          if (shorthand_R.length === 1) {
            shorthand_R.push(shorthand_R[0]);
          } else if (shorthand_R.length === 2) {
            shorthand_R = [
              shorthand_R[0],
              shorthand_R[1],
              shorthand_R[0],
              shorthand_R[1],
            ];
          } else if (shorthand_R.length === 3) {
            shorthand_R = [
              shorthand_R[0],
              shorthand_R[1],
              shorthand_R[2],
              shorthand_R[1],
            ];
          }
        }
      } else {
        const defaultRadius = squircleRadii.every(isNaN)
          ? 8 * distanceRatio
          : 0;
        shorthand_R = [
          defaultRadius,
          defaultRadius,
          defaultRadius,
          defaultRadius,
        ];
      }
    }
    squircleRadii = squircleRadii.map((val, i) =>
      isNaN(val) ? shorthand_R[i] : val,
    );
    const squrcleOutline = parseFloat(properties.get("--squircle-outline"), 10);
    const squrcleColor = properties.get("--squircle-fill").toString();
    const isSmooth = () => {
      if (typeof properties.get("--squircle-smooth")[0] !== "undefined") {
        if (squircleSmooth === 0) {
          return 1;
        }
        return squircleSmooth;
      } else {
        return 10;
      }
    };
    const isOutline = () => {
      if (squrcleOutline) {
        return squrcleOutline;
      } else {
        return 0;
      }
    };
    const isColor = () => {
      if (squrcleColor) {
        return squrcleColor;
      } else {
        return "#f45";
      }
    };
    const maxRadius = Math.max(...squircleRadii);

    const newGeom = {
      ...geom,
      width: squircleWidth,
      height: squircleHeight,
    };

    const offset = {
      x: squircleX,
      y: squircleY,
    };

    if (maxRadius < squircleWidth / 2 && maxRadius < squircleHeight / 2) {
      drawSquircle(
        ctx,
        newGeom,
        squircleRadii,
        isSmooth(),
        isOutline(),
        isColor(),
        offset,
      );
    } else {
      const minRadius = Math.min(squircleWidth / 2, squircleHeight / 2);
      drawSquircle(
        ctx,
        newGeom,
        squircleRadii.map(() => minRadius),
        isSmooth(),
        isOutline(),
        isColor(),
        offset,
      );
    }
  }
}
if (typeof registerPaint !== "undefined") {
  registerPaint("squircle", SquircleClass);
}
