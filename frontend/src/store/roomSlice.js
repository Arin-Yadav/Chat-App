// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// // Fetch all rooms
// export const fetchRooms = createAsyncThunk("rooms/fetchRooms", async () => {
//   const res = await axios.get(`${import.meta.env.VITE_API_URL}/rooms`, {
//     withCredentials: true,
//   });
//   return res.data;
// });

// // Create new room
// // export const createRoom = createAsyncThunk("rooms/createRoom", async (roomData) => {
// //   const res = await axios.post(`${import.meta.env.VITE_API_URL}/rooms/create`, roomData, {
// //     withCredentials: true,
// //   });
// //   return res.data;
// // });

// const roomSlice = createSlice({
//   name: "rooms",
//   initialState: {
//     list: [],
//     isLoading: false,
//     isError: false,
//     isSuccess: false,
//     error: null,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       // Fetch Rooms
//       .addCase(fetchRooms.pending, (state) => {
//         state.isLoading = true;
//         state.isError = false;
//         state.isSuccess = false;
//       })
//       .addCase(fetchRooms.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.isSuccess = true;
//         state.list = action.payload;
//       })
//       .addCase(fetchRooms.rejected, (state, action) => {
//         state.isLoading = false;
//         state.isError = true;
//         state.error = action.error.message;
//       })

//       // Create Room
//       // .addCase(createRoom.pending, (state) => {
//       //   state.isLoading = true;
//       // })
//       // .addCase(createRoom.fulfilled, (state, action) => {
//       //   state.isLoading = false;
//       //   state.isSuccess = true;
//       //   state.list.push(action.payload);
//       // })
//       // .addCase(createRoom.rejected, (state, action) => {
//       //   state.isLoading = false;
//       //   state.isError = true;
//       //   state.error = action.error.message;
//       // });
//   },
// });

// export default roomSlice.reducer;
