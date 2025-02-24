import { createStore } from 'vuex';

export default createStore({
  state: { materials: [] },
  mutations: {
    setMaterials(state, materials) { state.materials = materials; }
  }
});
