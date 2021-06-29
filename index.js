export default {
  install (Vue, opts) {
    let elementToReveal = {};
    let allElements = [];

    const options = {
      paddingTop: 100,
      paddingBottom: 100,
      interval: 200,
      once: true,
    };

    const uid = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

    const inYViewport = (el, paddingTop, paddingBottom) => {
      const rect = el.getBoundingClientRect();
      const windowHeight = (window.innerHeight || document.documentElement.clientHeight);
      const above = !((rect.bottom - paddingTop) > 0);
      const below = !((rect.top + paddingBottom) < windowHeight);
      return { inview: (!above && !below), above, below };
    };

    const revealCheck = (el, binding) => {
      const inviewTest = inYViewport(el, options.paddingTop, options.paddingBottom);
      const groupID = binding.value?.group ? binding.value.group : uid();
      if (!el.classList.contains('reveal-transition')
    && !el.classList.contains('revealed')
    && !elementToReveal[groupID]?.includes(el)
    && inviewTest.inview) {
        if (elementToReveal[groupID] === undefined) {
          elementToReveal[groupID] = [];
        }
        elementToReveal[groupID].push(el);

        if (options.once) {
          allElements = allElements.filter((it) => !(it.el.isSameNode(el)));
        }

        el.classList.add('reveal-transition');
        el.classList.remove('above');
        el.classList.remove('below');
      } else if (el.classList.contains('revealed') && !inviewTest.inview) {
        el.classList.remove('revealed');
        el.classList.add('unrevealed');

        if (inviewTest.above) {
          el.classList.add('above');
        } else if (inviewTest.below) {
          el.classList.add('below');
        }
      }
    };

    const throttle = (handler, timeout) => {
      const fixeTtimeout = typeof timeout !== 'undefined' ? timeout : 0;
      if (!handler || typeof handler !== 'function') throw new Error('Throttle handler argument is not incorrect. Must be a function.');
      let timeoutTime = 0;
      return (e) => {
        if (timeoutTime) return;
        timeoutTime = setTimeout(() => {
          timeoutTime = 0;
          handler(e);
        }, fixeTtimeout);
      };
    };

    const reveal = () => {
      allElements.forEach(({ el, binding }) => {
        revealCheck(el, binding);
      });

      setTimeout(() => {
        if (Object.keys(elementToReveal).length) {
          Object.entries(elementToReveal).forEach(([, values]) => {
            values.forEach((i, index) => {
              setTimeout(() => {
                i.classList.add('revealed');
                i.classList.remove('unrevealed');
                i.classList.remove('reveal-transition');
              }, index * options.interval);
            });
          });

          elementToReveal = {};
        }
      }, 0);
    };

    const throttleReveal = throttle(reveal, 16);

    Vue.directive('grouped-reveal', {
      inserted(el, binding) {
        el.classList.add('grouped-reveal');
        el.classList.add('unrevealed');
        el.classList.add('below');
        allElements.push({ el, binding });
        throttleReveal();
      },
      unbind(el) {
        allElements = allElements.filter((it) => !(it.el.isSameNode(el)));
      },
    });

    window.addEventListener('scroll', throttleReveal);
    window.addEventListener('resize', throttleReveal);
  }
}