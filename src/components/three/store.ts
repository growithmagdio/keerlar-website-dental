// Shared, mutable scroll state. Written by the DOM (scroll listeners), read every frame by the 3D scene.
// Kept outside React state so scrolling never triggers React re-renders.
export const story = {
  scene: 0, // fractional scene index (0 hero, 1 anatomy, 2 treatments, 3 implant, 4 family ... 9 booking)
  treat: -1, // fractional treatment index inside the treatments scene (0..4), -1 when outside
  anat: 0, // 0..1 progress through the anatomy scene
  impl: 0, // 0..1 progress through the implant scene
  focus: -1, // anatomy layer the visitor is pointing at (0 enamel, 1 dentin, 2 pulp, 3 root), -1 none
  mouseX: 0,
  mouseY: 0,
  reduced: false,
  fast: false, // QA only (?qa in the URL): skip easing so screenshots show the settled state
};
