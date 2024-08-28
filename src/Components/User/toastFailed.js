import 'react-toastify/dist/ReactToastify.css'
import { toast } from 'react-toastify';

const showErrorNotification = (message) => {
    toast.error(message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
    });
};

export{showErrorNotification} 