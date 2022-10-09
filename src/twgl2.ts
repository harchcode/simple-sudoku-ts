import { mat4, vec3 } from "gl-matrix";
import {
  createWebGLBufferInfo,
  drawWebGLBuffers,
  getAttribLocation,
  getUniformLocations,
  initWebGLShaderProgram,
  setWebGLAttribs
} from "./twgl3";

const vsSource = `
    attribute vec4 aVertexPosition;
    uniform mat4 uVPMatrix;

    void main() {
      gl_Position = uVPMatrix * aVertexPosition;
    }
  `;

const fsSource = `
    void main() {
      gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    }
  `;

class Camera2D {
  x = 0;
  y = 0;
  width = 0;
  height = 0;

  private viewMatrix = mat4.create();
  private projectionMatrix = mat4.create();
  private vpMatrix = mat4.create();
  private eye = vec3.create();
  private center = vec3.create();
  private up = vec3.create();

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  getVPMatrix() {
    const {
      x,
      y,
      // width,
      // height,
      eye,
      center,
      up,
      projectionMatrix,
      viewMatrix,
      vpMatrix
    } = this;

    // const w = width * 0.5;
    // const h = height * 0.5;

    vec3.set(eye, x, y, 10);
    vec3.set(center, x, y, 0);
    vec3.set(up, 0, 1, 0);

    // const fieldOfView = (45 * Math.PI) / 180; // in radians
    // const aspect = width / height;
    // const zNear = 0.1;
    // const zFar = 100.0;

    // note: glmatrix.js always has the first argument
    // as the destination to receive the result.
    // mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

    mat4.ortho(projectionMatrix, -1, 1, -1, 1, 3, 20);
    mat4.lookAt(viewMatrix, eye, center, up);
    mat4.multiply(vpMatrix, projectionMatrix, viewMatrix);

    return vpMatrix;
  }
}

// class Renderer {
//   readonly canvas: HTMLCanvasElement;
//   readonly gl: WebGLRenderingContext;

//   constructor(canvas: HTMLCanvasElement) {
//     this.canvas = canvas;
//     this.gl = canvas.getContext("webgl", {}) as WebGLRenderingContext;
//     this.gl.getExtension("OES_standard_derivatives");
//     this.gl.enable(this.gl.BLEND);
//     this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
//   }

//   clear() {
//     this.gl.clear(this.gl.COLOR_BUFFER_BIT);
//   }

//   setClearColor() {
//     this.gl.clearColor(1, 1, 1, 1);
//   }

//   loadShader = (type: number, code: string): WebGLShader => {
//     const { gl } = this;

//     const shader = gl.createShader(type);

//     if (!shader) throw "Failed to create shader.";

//     gl.shaderSource(shader, code);
//     gl.compileShader(shader);

//     if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
//       gl.deleteShader(shader);

//       throw "A shader compiling error occurred: " + gl.getShaderInfoLog(shader);
//     }

//     return shader;
//   };

//   compileShader = (
//     vertexShader: WebGLShader,
//     fragmentShader: WebGLShader
//   ): WebGLProgram => {
//     const { gl } = this;

//     const program = gl.createProgram();

//     if (!program) throw "Failed to create shader program.";

//     gl.attachShader(program, vertexShader);
//     gl.attachShader(program, fragmentShader);
//     gl.linkProgram(program);

//     if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
//       throw "Error linking shader";
//     }

//     return program;
//   };

//   loadAndCompileShader = (
//     vertexShaderCode: string,
//     fragmentShaderCode: string
//   ): WebGLProgram => {
//     const { gl } = this;

//     const vs = this.loadShader(gl.VERTEX_SHADER, vertexShaderCode);
//     const fs = this.loadShader(gl.FRAGMENT_SHADER, fragmentShaderCode);

//     return this.compileShader(vs, fs);
//   };

//   drawRect() {
//     const { gl } = this;

//     const shaderProgram = this.loadAndCompileShader(vsSource, fsSource);

//     const positionBuffer = gl.createBuffer();

//     gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

//     const positions = [0.5, 0.5, -0.5, 0.5, 0.5, -0.5, -0.5, -0.5];

//     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

//     gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
//     // gl.clearDepth(1.0); // Clear everything
//     // gl.enable(gl.DEPTH_TEST); // Enable depth testing
//     // gl.depthFunc(gl.LEQUAL); // Near things obscure far things
//     gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

//     const camera = new Camera2D(
//       0,
//       0,
//       gl.canvas.clientWidth,
//       gl.canvas.clientHeight
//     );

//     // Tell WebGL how to pull out the positions from the position
//     // buffer into the vertexPosition attribute.
//     {
//       const positionHandle = gl.getAttribLocation(
//         shaderProgram,
//         "aVertexPosition"
//       );

//       gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

//       gl.vertexAttribPointer(
//         positionHandle,
//         2, // each vertex element is a 3-float (x,y,z)
//         gl.FLOAT, // data type is FLOAT
//         false, // if the content is normalized vectors
//         0, // number of bytes to skip in between elements
//         0 // offsets to the first element
//       );

//       gl.enableVertexAttribArray(positionHandle);
//     }

//     gl.useProgram(shaderProgram);

//     gl.uniformMatrix4fv(
//       gl.getUniformLocation(shaderProgram, "uVPMatrix"),
//       false,
//       camera.getVPMatrix()
//     );

//     {
//       gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
//     }
//   }
// }

function main() {
  const canvas = document.querySelector("#glCanvas") as HTMLCanvasElement;

  // const g = new Renderer(canvas);

  // g.drawRect();

  const gl = canvas.getContext("webgl");
  if (!gl) return;

  const program = initWebGLShaderProgram(gl, vsSource, fsSource);
  if (!program) return;

  const uniformLocations = getUniformLocations(gl, program);
  const attribLocations = getAttribLocation(gl, program);

  const arrays = {
    aVertexPosition: new Float32Array([
      0.5, 0.5, 0, -0.5, 0.5, 0, 0.5, -0.5, 0, -0.5, -0.5, 0
    ])
  };

  const bufferInfo = createWebGLBufferInfo(gl, arrays);

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  const camera = new Camera2D(0, 0, gl.canvas.width, gl.canvas.height);

  gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
  // gl.clearDepth(1.0); // Clear everything
  // gl.enable(gl.DEPTH_TEST); // Enable depth testing
  // gl.depthFunc(gl.LEQUAL); // Near things obscure far things
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.useProgram(program);
  setWebGLAttribs(gl, attribLocations, bufferInfo);
  gl.uniformMatrix4fv(uniformLocations.uVPMatrix, false, camera.getVPMatrix());
  drawWebGLBuffers(gl, bufferInfo);
}

window.onload = main;
