document.addEventListener('DOMContentLoaded', function () {
    const buttons = document.querySelectorAll('.vitals-featured-content-card-button');

    buttons.forEach((button) => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            this.classList.add('clicked');

            const url = this.dataset.url;

            setTimeout(() => {
                if (url) {
                    window.location.href = url;
                }
            }, 400);
        });
    });
});