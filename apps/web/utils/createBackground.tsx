const mouse = { x: -1, y: -1 };
let lastTime = Date.now();

export const createBackground = (canvas: HTMLCanvasElement) => {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  canvas.width = window.innerWidth - 40;
  canvas.height = window.innerHeight - 40;
  window.onresize = () => {
    canvas.width = window.innerWidth - 40;
    canvas.height = window.innerHeight - 40;
  };

  const gradient = ctx.createRadialGradient(50, 50, 80, 80, 80, 100);
  gradient.addColorStop(0, "red");
  gradient.addColorStop(1, "white");
  window.onmousemove = (e) => {
    const currentTime = Date.now();
    const { clientX, clientY } = e;
    const timeDiff = currentTime - lastTime;

    const vx = ((clientX - mouse.x) / timeDiff) * 5;
    const vy = ((clientY - mouse.y) / timeDiff) * 5;

    Ball.instances.push(new Ball(clientX, clientY, 100, vx, vy));

    mouse.x = e.x;
    mouse.y = e.y;
    lastTime = currentTime;
  };

  // const grian950 = "#021c0e";
  // const grian700 = "#0eaa51";

  // canvas.style.backgroundColor = grian950;

  const image = new Image();
  image.src = "subtract-thin.svg";

  function animate() {
    if (!ctx) {
      return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    Ball.instances.forEach((ball) => {
      ball.draw(ctx);
      ball.delete();
    });
    const pattern = ctx?.createPattern(image, "repeat");
    ctx.fillStyle = pattern as CanvasPattern;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    requestAnimationFrame(animate);
  }
  animate();
};

class Ball {
  x: number;
  y: number;
  size: number;
  velX: number;
  vely: number;
  lifetime: number = 0;
  angle: number;
  alpha: number = 1;
  static instances: Ball[] = [];

  constructor(x: number, y: number, size: number, velX: number, vely: number) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.velX = velX;
    this.vely = vely;
    this.angle = 100;
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.x += this.velX;
    this.y += this.vely;
    this.alpha -= 0.01;

    ctx.beginPath();
    ctx.fillStyle = `rgba(19, 236, 113, ${this.alpha})`;
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();

    this.lifetime++;
  }
  delete() {
    if (this.alpha < 0) {
      Ball.instances = Ball.instances.filter((ball) => ball !== this);
    }
  }
}
