import { useDispatch, useSelector } from "react-redux"
import { updateToken } from "../reducers/UserSlice";
import axios from "axios";

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}
const useUpdateToken = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user);
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const { info: userInfo, jwt: accessToken } = user ? user : storedUser ? storedUser : { info: null, jwt: null };

    const isExpired = () => {
        if (!userInfo || !userInfo.exp) {
            return true;
        }
        return (Date.now() >= userInfo.exp * 1000);
    }
    const updateToken = async () => {
        
        if (!accessToken || isExpired()) {
            console.log('try update');
            try {
                const response = await axios.post('http://localhost:8081/api/auth/token', {}, { withCredentials: true });
                console.log(response);
                const newAccessToken = response.data.accessToken;
                const newUserInfo = parseJwt(newAccessToken);
                // Обновляем состояние в Redux
                dispatch(updateToken({ info: newUserInfo, jwt: newAccessToken }));
                // Обновляем localStorage
                localStorage.setItem('user', JSON.stringify({ info: newUserInfo, jwt: newAccessToken }));
                return true;
            } catch (error) {
                return false;
            }
        } 
    }
    return updateToken;
}

// const request = async (type, url, payload, headers=null, withCredentials=true, setLoading=null, setError=null) => {
//     switch (type) {
//         case 'GET':

//             break;
//         case 'POST':


//         default:
//             break;
//     }
// }

export default useUpdateToken;