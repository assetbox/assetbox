export const EXTENSIONS = {
  icon: ["svg"],
  image: ["png", "jpg", "jpeg", "gif", "webp"],
  animation: ["json"],
  all: function () {
    return [...this.icon, ...this.image, ...this.animation];
  },
};
