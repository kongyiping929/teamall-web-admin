const CHANGE_LOADING = 'lottery/loading/CHANGE_LOADING';

export const changeLoading = status => dispatch => {
    dispatch({
        type: CHANGE_LOADING,
        status
    })
}

export default function loading(state=false, action) {
    switch (action.type) {
        case CHANGE_LOADING:
            return action.status;
        default:
            return state;
    }
}