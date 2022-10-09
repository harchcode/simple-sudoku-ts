function loadShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);

  if (!shader) return undefined;

  gl.shaderSource(shader, source);

  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(
      "An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader)
    );
    gl.deleteShader(shader);
    return undefined;
  }

  return shader;
}

export function initWebGLShaderProgram(
  gl: WebGLRenderingContext,
  vsSource: string,
  fsSource: string
) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  if (!vertexShader || !fragmentShader) return undefined;

  const shaderProgram = gl.createProgram();

  if (!shaderProgram) return undefined;

  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert(
      "Unable to initialize the shader program: " +
        gl.getProgramInfoLog(shaderProgram)
    );
    return undefined;
  }

  return shaderProgram;
}

export function getUniformLocations(
  gl: WebGLRenderingContext,
  program: WebGLProgram
): Record<string, WebGLUniformLocation> {
  const uniformLocations: Record<string, WebGLUniformLocation> = {};
  const uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);

  for (let i = 0; i < uniformCount; i++) {
    const name = gl.getActiveUniform(program, i)?.name;

    if (!name) continue;
    if (name.startsWith("gl_") || name.startsWith("webgl_")) continue;

    const location = gl.getUniformLocation(program, name);
    if (location === null) continue;

    uniformLocations[name] = location;
  }

  return uniformLocations;
}

export function getAttribLocation(
  gl: WebGLRenderingContext,
  program: WebGLProgram
): Record<string, number> {
  const attribLocations: Record<string, number> = {};
  const attributeCount = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);

  for (let i = 0; i < attributeCount; i++) {
    const name = gl.getActiveAttrib(program, i)?.name;

    if (!name) continue;
    if (name.startsWith("gl_") || name.startsWith("webgl_")) continue;

    const location = gl.getAttribLocation(program, name);

    attribLocations[name] = location;
  }

  return attribLocations;
}

export type WebGLBufferData = {
  buffer: WebGLBuffer;
  length: number;
  size: number;
  type: number;
  normalized: boolean;
  stride: number;
  offset: number;
  drawMode: number;
};

export type WebGLBufferDataOptions = {
  size?: number;
  type?: number;
  normalized?: boolean;
  stride?: number;
  offset?: number;
  drawMode?: number;
};

export type WebGLBufferInfo<T extends string | number | symbol> = Record<
  T,
  WebGLBufferData
>;

export function createWebGLBufferInfo<T extends Record<string, Float32Array>>(
  gl: WebGLRenderingContext,
  data: T,
  options?: Record<keyof T, WebGLBufferDataOptions>
): WebGLBufferInfo<keyof T> {
  const r: WebGLBufferInfo<string> = {};

  for (const k in data) {
    const v = data[k];

    const buffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, v, gl.STATIC_DRAW);

    if (!buffer) continue;

    const opts = options?.[k];

    r[k] = {
      buffer,
      length: v.length,
      size: opts?.size !== undefined ? opts.size : 3,
      type: opts?.type !== undefined ? opts.type : gl.FLOAT,
      normalized: opts?.normalized !== undefined ? opts.normalized : false,
      stride: opts?.stride !== undefined ? opts.stride : 0,
      offset: opts?.offset !== undefined ? opts.offset : 0,
      drawMode: opts?.drawMode !== undefined ? opts.drawMode : gl.TRIANGLE_STRIP
    };
  }

  return r as WebGLBufferInfo<keyof T>;
}

export function setWebGLAttribs(
  gl: WebGLRenderingContext,
  attribLocations: Record<string, number>,
  bufferInfo: WebGLBufferInfo<string>
) {
  for (const k in bufferInfo) {
    const data = bufferInfo[k];
    const location = attribLocations[k];

    gl.bindBuffer(gl.ARRAY_BUFFER, data.buffer);
    gl.vertexAttribPointer(
      location,
      data.size,
      data.type,
      data.normalized,
      data.stride,
      data.offset
    );
    gl.enableVertexAttribArray(location);
  }
}

export function drawWebGLBuffers(
  gl: WebGLRenderingContext,
  bufferInfo: WebGLBufferInfo<string>
) {
  for (const k in bufferInfo) {
    const data = bufferInfo[k];

    gl.bindBuffer(gl.ARRAY_BUFFER, data.buffer);
    gl.drawArrays(data.drawMode, 0, data.length / data.size);
  }
}
