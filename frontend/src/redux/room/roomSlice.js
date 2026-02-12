// import { createSlice } from "@reduxjs/toolkit";

// export const roomSlice = createSlice({
//   name: "rooms",
//   initialState: {
//     isEmpty: true,
//     list: [],
//   },
//   reducers: {
//     fethRooms: (state, action) => {
//       const payload = action.payload;
//       state.isEmpty = false;
//       state.list = payload;
//     },
//     createRoom: (state, action) => {
//       const payload = action.payload;
//       state.isEmpty = false;
//       state.list.push(payload);
//     },
//     deleteRoom: (state, action) => {
//       state.isEmpty = false;
//       state.list = [];
//     },
//   },
// });

// export const { fethRooms, createRoom, deleteRoom } = roomSlice.actions;
// export default roomSlice.reducer;
