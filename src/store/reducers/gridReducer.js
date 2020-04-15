import {STATE} from '../actions/actionTypes'

const initialState = {
    state: ""
}


export default (state = initialState, action) => {
    switch (action.type) {
    case STATE:
        return { ...state, ...action }
    default:
        return state
    }
}
