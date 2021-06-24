// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import {Attribute} from '../../../attribute';
import {Tensor} from '../../../tensor';
import {FunctionType, GlslValueFunction} from '../glsl-definitions';
import {getGlsl} from '../glsl-source';
import {WebGLInferenceHandler} from '../inference-handler';
import {ProgramInfo, TextureType} from '../types';

export function glslAbs(): GlslValueFunction {
  return glslBuiltinUnary('abs');
}
export function glslAcos(): GlslValueFunction {
  return glslBuiltinUnary('acos');
}
export function glslAsin(): GlslValueFunction {
  return glslBuiltinUnary('asin');
}
export function glslAtan(): GlslValueFunction {
  return glslBuiltinUnary('atan');
}
export function glslCeil(): GlslValueFunction {
  return glslBuiltinUnary('ceil');
}
export function glslCos(): GlslValueFunction {
  return glslBuiltinUnary('cos');
}
export function glslExp(): GlslValueFunction {
  return glslBuiltinUnary('exp');
}
export function glslFloor(): GlslValueFunction {
  return glslBuiltinUnary('floor');
}
export function glslIdentity(): GlslValueFunction {
  const name = 'indentity_';
  const body = `
  float ${name}(float a) {
    return a;
  }
  vec4 ${name}(vec4 v) {
    return v;
  }
  `;
  return {body, name, type: FunctionType.ValueBased};
}
export function glslLog(): GlslValueFunction {
  return glslBuiltinUnary('log');
}
export function glslNeg(): GlslValueFunction {
  const name = 'neg_';
  const body = `
  float ${name}(float a) {
    return -a;
  }
  vec4 ${name}(vec4 v) {
    return -v;
  }
  `;
  return {body, name, type: FunctionType.ValueBased};
}
export function glslNot(): GlslValueFunction {
  const name = 'not_';
  const body = `
  float ${name}(float a) {
    return float( ! bool(a) );
  }
  bool ${name}(bool a) {
    return !a;
  }
  vec4 ${name}(vec4 v) {
    return vec4(!bool(v.x), !bool(v.y), !bool(v.z), !bool(v.w));
  }
  bvec4 ${name}(bvec4 v) {
    return bvec4(!v.x, !v.y, !v.z, !v.w);
  }
  `;
  return {body, name, type: FunctionType.ValueBased};
}
export function glslSin(): GlslValueFunction {
  return glslBuiltinUnary('sin');
}
export function glslRelu(): GlslValueFunction {
  const name = 'relu_';
  const body = `
  float ${name}(float a) {
    return max( a, 0.0 );
  }
  vec4 ${name}(vec4 v) {
    return max( v, 0.0 );
  }
  `;
  return {body, name, type: FunctionType.ValueBased};
}
export function glslSigmoid(): GlslValueFunction {
  const name = 'sigmoid_';
  const body = `
  float ${name}(float a) {
    return 1.0 / (1.0 + exp(-a));
  }
  vec4 ${name}(vec4 v) {
    return 1.0 / (1.0 + exp(-v));
  }
  `;
  return {body, name, type: FunctionType.ValueBased};
}
export function glslSqrt(): GlslValueFunction {
  return glslBuiltinUnary('sqrt');
}
export function glslTan(): GlslValueFunction {
  return glslBuiltinUnary('tan');
}
export function glslTanh(): GlslValueFunction {
  const name = 'tanh_';
  const body = `
  float ${name}(float a) {
    a = clamp(a, -10., 10.);
    a = exp(2.*a);
    return (a - 1.) / (a + 1.);
  }
  vec4 ${name}(vec4 v) {
    v = clamp(v, -10., 10.);
    v = exp(2.*v);
    return (v - 1.) / (v + 1.);
  }
  `;
  return {body, name, type: FunctionType.ValueBased};
}
function glslBuiltinUnary(fname: string): GlslValueFunction {
  const name = `${fname}_`;
  const body = `
  float ${name}(float a) {
    return ${fname}(a);
  }
  vec4 ${name}(vec4 v) {
    return ${fname}(v);
  }
  `;
  return {body, name, type: FunctionType.ValueBased};
}

/////
/////
/////

const createElementwiseProgramInfo =
    (handler: WebGLInferenceHandler, input: Tensor, glslFunc: GlslValueFunction, _attributes?: Attribute):
        ProgramInfo => {
          const textureType = handler.session.pack ? TextureType.packed : TextureType.unpacked;
          const glsl = getGlsl(handler.session.backend.glContext.version);
          return {
            inputTypes: [textureType],
            inputNames: ['A'],
            output: {dims: input.dims, type: input.type, textureType},
            shaderSource: `
     ${glslFunc.body}
     void main() {
       vec4 v = ${glsl.texture2D}(A, TexCoords);
       v = ${glslFunc.name}(v);
       ${glsl.output} = v;
     }
     `,
            hasMain: true
          };
        };

export const abs = (handler: WebGLInferenceHandler, inputs: Tensor[]):
    Tensor[] => [handler.run(createElementwiseProgramInfo(handler, inputs[0], glslAbs()), inputs)];

export const acos = (handler: WebGLInferenceHandler, inputs: Tensor[]):
    Tensor[] => [handler.run(createElementwiseProgramInfo(handler, inputs[0], glslAcos()), inputs)];

export const asin = (handler: WebGLInferenceHandler, inputs: Tensor[]):
    Tensor[] => [handler.run(createElementwiseProgramInfo(handler, inputs[0], glslAsin()), inputs)];

export const atan = (handler: WebGLInferenceHandler, inputs: Tensor[]):
    Tensor[] => [handler.run(createElementwiseProgramInfo(handler, inputs[0], glslAtan()), inputs)];

export const ceil = (handler: WebGLInferenceHandler, inputs: Tensor[]):
    Tensor[] => [handler.run(createElementwiseProgramInfo(handler, inputs[0], glslCeil()), inputs)];

export const cos = (handler: WebGLInferenceHandler, inputs: Tensor[]):
    Tensor[] => [handler.run(createElementwiseProgramInfo(handler, inputs[0], glslCos()), inputs)];

export const exp = (handler: WebGLInferenceHandler, inputs: Tensor[]):
    Tensor[] => [handler.run(createElementwiseProgramInfo(handler, inputs[0], glslExp()), inputs)];

export const floor = (handler: WebGLInferenceHandler, inputs: Tensor[]):
    Tensor[] => [handler.run(createElementwiseProgramInfo(handler, inputs[0], glslFloor()), inputs)];

export const identity = (handler: WebGLInferenceHandler, inputs: Tensor[]):
    Tensor[] => [handler.run(createElementwiseProgramInfo(handler, inputs[0], glslIdentity()), inputs)];

export const log = (handler: WebGLInferenceHandler, inputs: Tensor[]):
    Tensor[] => [handler.run(createElementwiseProgramInfo(handler, inputs[0], glslLog()), inputs)];

export const neg = (handler: WebGLInferenceHandler, inputs: Tensor[]):
    Tensor[] => [handler.run(createElementwiseProgramInfo(handler, inputs[0], glslNeg()), inputs)];

export const not = (handler: WebGLInferenceHandler, inputs: Tensor[]):
    Tensor[] => [handler.run(createElementwiseProgramInfo(handler, inputs[0], glslNot()), inputs)];

export const relu = (handler: WebGLInferenceHandler, inputs: Tensor[]):
    Tensor[] => [handler.run(createElementwiseProgramInfo(handler, inputs[0], glslRelu()), inputs)];

export const sigmoid = (handler: WebGLInferenceHandler, inputs: Tensor[]):
    Tensor[] => [handler.run(createElementwiseProgramInfo(handler, inputs[0], glslSigmoid()), inputs)];

export const sin = (handler: WebGLInferenceHandler, inputs: Tensor[]):
    Tensor[] => [handler.run(createElementwiseProgramInfo(handler, inputs[0], glslSin()), inputs)];

export const sqrt = (handler: WebGLInferenceHandler, inputs: Tensor[]):
    Tensor[] => [handler.run(createElementwiseProgramInfo(handler, inputs[0], glslSqrt()), inputs)];

export const tan = (handler: WebGLInferenceHandler, inputs: Tensor[]):
    Tensor[] => [handler.run(createElementwiseProgramInfo(handler, inputs[0], glslTan()), inputs)];

export const tanh = (handler: WebGLInferenceHandler, inputs: Tensor[]):
    Tensor[] => [handler.run(createElementwiseProgramInfo(handler, inputs[0], glslTanh()), inputs)];
