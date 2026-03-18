Component({
  properties: {
    show: { type: Boolean, value: false },
    list: { type: Array, value: [] },
    current: { type: Number, value: 0 },
  },

  methods: {
    handleSelect(e) {
      const index = e.currentTarget.dataset.index;
      this.triggerEvent('select', { value: index });
    },

    handleClose() {
      this.triggerEvent('close');
    },

    handleMaskTap() {
      this.triggerEvent('close');
    },

    preventBubble() {},
  },
});
