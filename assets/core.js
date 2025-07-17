(function () {
    var ui = {
        inits: [],
    };

    function openReveal(container) {
        const containers = typeof container === 'string' ? document.querySelectorAll(container) : [container];
        
        containers.forEach(box => {
            const reveal = box.querySelector('[sv-reveal]');
            if (!reveal) return;

            reveal.style.height = 'auto';
            const height = reveal.offsetHeight + 'px';
            reveal.style.height = '0px';
            
            requestAnimationFrame(() => {
                reveal.style.height = height;
            });

            box.classList.add('open');
        });
    }
    function closeReveal(container) {
        const containers = typeof container === 'string' ? document.querySelectorAll(container) : [container];
        
        containers.forEach(box => {
            const reveal = box.querySelector('[sv-reveal]');
            if (!reveal) return;

            const height = reveal.offsetHeight + 'px';
            reveal.style.height = height;

            requestAnimationFrame(() => {
                reveal.style.height = '0px';
            });

            box.classList.remove('open');
        });
    }

    function init_foldout() {
        function closeAllFoldouts() {
            document.querySelectorAll('[sv-foldout].open').forEach(box => {
                closeReveal(box);
            });
        }

        document.querySelectorAll('[sv-foldout] [sv-die]').forEach(die => {
            die.addEventListener('click', () => {
                const box = die.closest('[sv-foldout]');
                if (!box) return;

                var isOpen = box.classList.contains('open');

                closeAllFoldouts();
    
                if (isOpen) {
                    closeReveal(box);
                } else {
                    openReveal(box);
                }
            });
        });

        document.addEventListener('click', (e) => {
            const isInFoldout = e.target.closest('[sv-foldout] [sv-die]');
            if (!isInFoldout) {
                closeAllFoldouts();
            }
        });

        window.addEventListener('scroll', () => {
            closeAllFoldouts();
        }, { passive: true });
    }
    ui.inits.push(init_foldout);

    function init_ui() {
        ui.inits.forEach(func => {
            func();
        });
    }

    window.addEventListener('load', function (event) {
        init_ui();
    });
    
})();