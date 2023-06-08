import { Transform } from 'class-transformer';

export function TransformTrimSpace(): PropertyDecorator {
  return Transform((param) => {
    if (param.value && typeof param.value === 'string') {
      return param.value.trim();
    }
    return param.value;
  });
}
