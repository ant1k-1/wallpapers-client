const initialState = {
  agreementAccepted: false
};

const agreementReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'TOGGLE_AGREEMENT':
        return {
          ...state,
          agreementAccepted: !state.agreementAccepted
        };
      default:
        return state;
    }
};

export default agreementReducer;