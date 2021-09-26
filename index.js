"use strict"

const VueGroupedReveal = {
  install(Vue, opts) {
    let elementToReveal = {};
    let elementToHide = {};
    let allElements = [];
    let scrollPos = 0;
    
    let options = {
      paddingTop: 100,
      paddingBottom: 100,
      interval: 200,
      once: true,
      transition: 500,
    };

    options = Object.assign(options, opts);

    const uid = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

    const inYViewport = (el, paddingTop, paddingBottom) => {
      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      const above = !(rect.bottom - paddingTop > 0);
      const below = !(rect.top + paddingBottom < windowHeight);
      return {
        inview: !above && !below,
        above,
        below,
      };
    };

    const revealCheck = (el, binding, dir) => {
      const inviewTest = inYViewport(el, options.paddingTop, options.paddingBottom);
      const groupID = binding.value && binding.value.group ? binding.value.group : uid();

      if (!el._revealTransition && (!el.classList.contains('revealed') || (el.classList.contains('revealed') && el._revealTransitionOut)) && inviewTest.inview) {
        if (elementToReveal[groupID] === undefined) {
          elementToReveal[groupID] = [];
        }
        if(el._revealTransitionOut){
          console.log("In and out");
        }

        let vec = dir < 0 ? 'above' : 'below';
        elementToReveal[groupID].push({el, vec});        
        el.classList.add(vec);
        

        if (options.once) {
          allElements = allElements.filter((it) => !it.el.isSameNode(el));
        }

        el._revealTransition = true;
      } else if (!el._revealTransitionOut && el.classList.contains('revealed') && !inviewTest.inview) {
        if (elementToHide[groupID] === undefined) {
          elementToHide[groupID] = [];
        }

        if(el._revealTransition){
          console.log("Out and In");
        }


        let vec = inviewTest.above ? 'above' : 'below';
        elementToHide[groupID].push({el, vec });
        
        el._revealTransitionOut = true;        
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
      var dir = 1;
      // detects new state and compares it with the new one
      if ((document.body.getBoundingClientRect()).top > scrollPos){
        dir = -1
      }
      // saves the new position for iteration.
      scrollPos = (document.body.getBoundingClientRect()).top;

      allElements.forEach(({
        el,
        binding,
      }) => {
        revealCheck(el, binding, dir);
      });
      setTimeout(() => {
        //console.log(elementToHide);
        if (Object.keys(elementToHide).length) {
          Object.entries(elementToHide).forEach(([, values]) => {
            values.forEach((i, index) => {
              setTimeout(() => {
                i.el.style.transitionDuration = options.transition+'ms'
                i.el.classList.remove('revealed');
                i.el.classList.add('unrevealed');
                i.el.classList.add(i.vec);
                
                setTimeout(() => {
                  i.el.style.transitionDuration = 0+'ms'
                  i.el._revealTransitionOut = false;
                }, options.transition);
              }, index * options.interval);
            });
          });
          elementToHide = {};
        }
      }, 0);

      setTimeout(() => {
        if (Object.keys(elementToReveal).length) {
          Object.entries(elementToReveal).forEach(([, values]) => {
            values.forEach((i, index) => {
              setTimeout(() => {
                i.el.style.transitionDuration = options.transition+'ms'
                i.el.classList.add('revealed');
                i.el.classList.remove('above');
                i.el.classList.remove('below');
                i.el.classList.remove('unrevealed');
                setTimeout(() => {
                  i.el.style.transitionDuration = 0+'ms'
                  i.el._revealTransition = false;
                }, options.transition);
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
        
        
        allElements.push({
          el,
          binding,
        });
        throttleReveal();
      },

      unbind(el) {
        allElements = allElements.filter((it) => !it.el.isSameNode(el));
      },

    });
    window.addEventListener('scroll', throttleReveal);
    window.addEventListener('resize', throttleReveal);
  },

};



if (typeof exports === 'object' && typeof module !== 'undefined') {  
  Object.defineProperty(exports, '__esModule', {
    value: true,
  });
  exports.default = VueGroupedReveal;
}
