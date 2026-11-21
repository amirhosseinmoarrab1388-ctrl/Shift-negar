(() => {
  const stage = document.querySelector('.stage.large');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  function setHands() {
    const now = new Date();
    const minutes = now.getMinutes() + now.getSeconds() / 60;
    stage.style.setProperty('--hour', (now.getHours() * 30 + minutes / 2) + 'deg');
    stage.style.setProperty('--minute', minutes * 6 + 'deg');
    stage.style.setProperty('--second', now.getSeconds() * 6 + 'deg');
  }
  setHands();
  setInterval(() => {
    if (!document.hidden && !document.getElementById('gate').hidden) setHands();
  }, 1000);
  document.querySelectorAll('.stage').forEach(scene => {
    function reset() {
      scene.style.removeProperty('--dx');
      scene.style.removeProperty('--dy');
    }
    scene.addEventListener('pointermove', e => {
      if (reduced.matches) return;
      const rect = scene.getBoundingClientRect();
      const fraction = n => Math.min(1, Math.max(0, n)) - 0.5;
      scene.style.setProperty('--dx', fraction((e.clientX - rect.left) / rect.width) * 54 + 'deg');
      scene.style.setProperty('--dy', -fraction((e.clientY - rect.top) / rect.height) * 32 + 'deg');
    });
    ['pointerleave', 'pointercancel', 'pointerup'].forEach(type => scene.addEventListener(type, reset));
    reduced.addEventListener('change', reset);
  });
})();
