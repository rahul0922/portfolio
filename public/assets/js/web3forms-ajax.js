document.addEventListener("DOMContentLoaded", function () {
    const forms = document.querySelectorAll('form[action="https://api.web3forms.com/submit"]');
    const modal = document.getElementById('aesthetic-modal');
    const modalCloseBtn = document.getElementById('aesthetic-modal_close');

    if (modalCloseBtn && modal) {
        modalCloseBtn.addEventListener('click', () => {
            modal.classList.remove('show');
        });
    }

    forms.forEach(form => {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="btn_text">Sending...</span>';
            submitBtn.disabled = true;

            const formData = new FormData(form);
            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            })
                .then(async (response) => {
                    let json = await response.json();
                    if (response.status == 200) {
                        submitBtn.innerHTML = '<span class="btn_text">Message Sent! ✓</span>';
                        form.reset();

                        // Show aesthetic modal
                        if (modal) {
                            modal.classList.add('show');
                            // Auto close after 5 seconds
                            setTimeout(() => {
                                modal.classList.remove('show');
                            }, 5000);
                        }

                        setTimeout(() => {
                            submitBtn.innerHTML = originalBtnText;
                            submitBtn.disabled = false;
                        }, 3000);
                    } else {
                        console.log(response);
                        submitBtn.innerHTML = '<span class="btn_text">Error. Try Again.</span>';
                        submitBtn.disabled = false;
                    }
                })
                .catch(error => {
                    console.log(error);
                    submitBtn.innerHTML = '<span class="btn_text">Error. Try Again.</span>';
                    submitBtn.disabled = false;
                });
        });
    });
});
