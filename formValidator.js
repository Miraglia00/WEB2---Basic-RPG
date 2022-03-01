const submit = $('#submitBtn');

const validateInputField = (self) => {
    if($(self).val().length >= 4) {
        if($(self).attr('type') === 'password' && $('#registerForm').find(self).length) {
            const other = $(self).attr('id') === 'registerPassword_1' ? '#registerPassword_2' : '#registerPassword_1';

            if($(other).val() !== $(self).val()) {
                removeErrorMessage(self);
                addErrorMessage(self, "The two password must be the same!");

                return false;
            }else{
                removeErrorMessage(self)
                removeErrorMessage(other);
                markAsValid(self);
                markAsValid(other);

                checkFormReady();

            }
        }else {
            removeErrorMessage(self);
            markAsValid(self);
            checkFormReady();
        }
    }else{
        removeErrorMessage(self);
        addErrorMessage(self, "Must be at least 4 character long!");
        return false;
    }
}

const getInputFields = (modal) => {
    return $(modal).find('.card-body:not(.hidden) input')
}

const checkInputFields = (modal) => {
    let inputFields = getInputFields(modal);
    for(let i = 0; i < inputFields.length; i++) {
        if($(inputFields[i]).val().length === 0) {
            addErrorMessage(inputFields[i], "This field is required!");
            checkFormReady();
        }else{
            validateInputField(inputFields[i]);
        }
    }
} 

const addErrorMessage = (input, message) => {
    if(!$(input).hasClass('is-invalid')) {
        $(input).after(`<small class='text-danger text-center w-100 fs-6 m-0 p-0'>${message}</small>`);
        $(input).addClass('is-invalid');
    }
}

const removeErrorMessage = (input) => {
    if($(input).hasClass('is-invalid')) {
        $(input).next().remove();
        $(input).removeClass('is-invalid');
    }
}

const markAsValid = (input) => {
    if(!$(input).hasClass('is-valid')) {
        removeErrorMessage(input);
        $(input).addClass('is-valid');
    }
    
}

const checkFormReady = () => {
    let inputs = getInputFields('#userDialog');
    let isReady = true;
    for(let i = 0; i < inputs.length; i++) {
        if($(inputs[i]).hasClass('is-invalid')) {
            console.log('false')
            isReady = false;
            break;
        }
    }

    if(isReady){
        setDisabled(false);
    }else{
        setDisabled(true);
    }
}

const setDisabled = (t) => {
    (t) ? submit.attr('disabled', 'disabled').addClass('disabled') : submit.removeAttr('disabled').removeClass('disabled')
}
