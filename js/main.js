class Shape {
  constructor(name, x, y, xVelocity, yVelocity, R, G, B) {
    this._name = name;
    this._x = x;
    this._y = y;
    this._xVelocity = xVelocity;
    this._yVelocity = yVelocity;
    this._R = R;
    this._G = G;
    this._B = B;
  }

  get name() {
    return this._name;
  }

  set name(value) {
    this._name = value;
  }

  get x() {
    return this._x;
  }

  set x(value) {
    this._x = value;
  }

  get y() {
    return this._y;
  }

  set y(value) {
    this._y = value;
  }

  get xVelocity() {
    return this._xVelocity;
  }

  set xVelocity(value) {
    this._xVelocity = value;
  }

  get yVelocity() {
    return this._yVelocity;
  }

  set yVelocity(value) {
    this._yVelocity = value;
  }

  get RGB() {
    return [this._R, this._G, this._B];
  }

  set RGB(value) {
    [this._R, this._G, this._B] = value;
  }
}

class Circle extends Shape {
  constructor(name, x, y, xVelocity, yVelocity, R, G, B, radius) {
    super(name, x, y, xVelocity, yVelocity, R, G, B);
    this._radius = radius;
  }

  get radius() {
    return this._radius;
  }

  set radius(value) {
    this._radius = value;
  }
}

class Rectangle extends Shape {
  constructor(name, x, y, xVelocity, yVelocity, R, G, B, width, height) {
    super(name, x, y, xVelocity, yVelocity, R, G, B);
    this._width = width;
    this._height = height;
  }

  get width() {
    return this._width;
  }

  set width(value) {
    this._width = value;
  }

  get height() {
    return this._height;
  }

  set height(value) {
    this._height = value;
  }
}

const fetchShapes = async () => {
  try {
    const response = await fetch("data/shapes.json");
    const shapeData = await response.json();

    const shapes = shapeData.map((shape) => {
      if (shape.type === "Circle") {
        return new Circle(
          shape.name,
          shape.x,
          shape.y,
          shape.xVelocity,
          shape.yVelocity,
          shape.R,
          shape.G,
          shape.B,
          shape.radius
        );
      } else if (shape.type === "Rectangle") {
        return new Rectangle(
          shape.name,
          shape.x,
          shape.y,
          shape.xVelocity,
          shape.yVelocity,
          shape.R,
          shape.G,
          shape.B,
          shape.width,
          shape.height
        );
      }

      return null;
    });

    return shapes.filter((shape) => shape !== null);
  } catch (error) {
    console.error(error);
  }
};

const handleRectangleBoundaryCollision = (rectangle, canvas) => {
  if (rectangle.y <= 0 || rectangle.y + rectangle.height >= canvas.height) {
    rectangle.yVelocity *= -1;
  }
  if (rectangle.x <= 0 || rectangle.x + rectangle.width >= canvas.width) {
    rectangle.xVelocity *= -1;
  }
};

const handleCircleBoundaryCollision = (circle, canvas) => {
  if (
    circle.y - circle.radius <= 0 ||
    circle.y + circle.radius >= canvas.height
  ) {
    circle.yVelocity *= -1;
  }
  if (
    circle.x - circle.radius <= 0 ||
    circle.x + circle.radius >= canvas.width
  ) {
    circle.xVelocity *= -1;
  }
};

const updateShapeCoordinates = (shapes) => {
  shapes.forEach((shape) => {
    shape.x += shape.xVelocity;
    shape.y += shape.yVelocity;
  });
};

const render = (canvas, ctx, shapes) => {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  shapes.forEach((shape) => {
    const rgbValues = shape.RGB.join(",");
    ctx.fillStyle = `rgb(${rgbValues})`;

    if (shape instanceof Rectangle) {
      ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
    } else if (shape instanceof Circle) {
      ctx.beginPath();
      ctx.arc(shape.x, shape.y, shape.radius, 0, 2 * Math.PI);
      ctx.fill();
      ctx.closePath();
    }
  });
};

const mainLoop = (shapes, canvas, ctx) => {
  updateShapeCoordinates(shapes);
  render(canvas, ctx, shapes);

  shapes.forEach((shape) => {
    if (shape instanceof Rectangle) {
      handleRectangleBoundaryCollision(shape, canvas);
    } else if (shape instanceof Circle) {
      handleCircleBoundaryCollision(shape, canvas);
    }
  });

  requestAnimationFrame(() => mainLoop(shapes, canvas, ctx));
};

initializeCanvas = () => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  document.body.append(canvas);
  ctx.fillStyle = "black";
  canvas.width = 1280;
  canvas.height = 720;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  return { canvas, ctx };
};

fetchShapes().then((shapes) => {
  const { canvas, ctx } = initializeCanvas();
  mainLoop(shapes, canvas, ctx);
});
