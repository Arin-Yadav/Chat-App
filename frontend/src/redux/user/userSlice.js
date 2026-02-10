import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    isLoggedIn: false,
    user: {},
  },
  reducers: {
    setUser: (state, action) => {
      const payload = action.payload;
      state.isLoggedIn = true;
      state.user = payload;
    },
    removeUser: (state) => {
      state.isLoggedIn = false;
      state.user = {};
    },
  },
});

export const { setUser, removeUser } = userSlice.actions;
export default userSlice.reducer;

// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// // Login thunk
// export const loginUser = createAsyncThunk(
//   "auth/loginUser",
//   async (credentials) => {
//     const res = await axios.post(
//       `${import.meta.env.VITE_API_URL}/auth/login`,
//       credentials,
//       { withCredentials: true },
//     );
//     // console.log(res.data)
//     return res.data; // { token, userName }
//   },
// );

// const initialState = {
//   token: localStorage.getItem("token") || null,
//   user: localStorage.getItem("user"),
//   isLoading: false,
//   isError: false,
//   error: null,
// };

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     logout: (state) => {
//       state.token = null;
//       state.user = null;
//       localStorage.removeItem("token");
//       localStorage.removeItem("user");
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(loginUser.pending, (state) => {
//         state.isLoading = true;
//         state.isError = false;
//       })
//       .addCase(loginUser.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.token = action.payload.token;
//         state.user = action.payload.username;

//         // ✅ Persist to localStorage
//         localStorage.setItem("token", action.payload.token);
//         localStorage.setItem("user", action.payload.username);
//       })
//       .addCase(loginUser.rejected, (state, action) => {
//         state.isLoading = false;
//         state.isError = true;
//         state.error = action.error.message;
//       });
//   },
// });

// export const { logout } = authSlice.actions;
// export default authSlice.reducer;
