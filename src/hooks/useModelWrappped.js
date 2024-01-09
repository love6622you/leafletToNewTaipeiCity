import { computed } from 'vue';

export default function useModelWrapper(props, emit, key) {
  return computed({
    get: () => props[key],
    set: (value) => emit(`update:${key}`, value),
  });
}
