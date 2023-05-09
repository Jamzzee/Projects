(() => {
    const switcher = {
        buttonModal: document.querySelector(".header__modal-btn"),
        iconOpen: document.querySelector(".modal-btn--open"),
        iconClose: document.querySelector(".modal-btn--close"),
        dropMenu: document.querySelector(".header__drop-menu")

        
    };

    switcher.buttonModal.addEventListener("click", toggleModal);

    function toggleModal(){
        switcher.iconOpen.classList.toggle("is-hidden");
        switcher.iconClose.classList.toggle("is-hidden");
        switcher.dropMenu.classList.toggle("is-hidden");
    }
})();
