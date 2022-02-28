const nameInput = $('#username');
const submit = $('#saveData');

const validateInputField = () => {
    if(nameInput.val().length >= 3) {
        setDisabled(false);
        console.log(nameInput.val())
    }else{
        setDisabled(true);
    }
}

const setDisabled = (t) => {
    (t) ? submit.attr('disabled', 'disabled').addClass('disabled') : submit.removeAttr('disabled').removeClass('disabled')
}
